const express = require('express');
const { body, validationResult } = require('express-validator');
const ShopOrder = require('../models/ShopOrder');
const { protect } = require('../middleware/auth');
const { validateShippingAddress } = require('../utils/validateShippingAddress');
const {
  isPaystackConfigured,
  getPaystackKeyStatus,
  frontendBaseUrl,
  paystackRequest,
  verifyWebhookSignature,
  verifyTransactionReference,
} = require('../lib/paystack');
const {
  queueAdminNewOrder,
} = require('../lib/orderNotifications');
const { validateOrderItems, totalsMatch } = require('../lib/orderPricing');
const {
  findReusablePaystackOrder,
  cancelSupersededPaystackOrders,
} = require('../lib/shopOrderCheckout');

const router = express.Router();

// @desc    Paystack public config (no secrets)
// @route   GET /api/payments/config
// @access  Public
router.get('/config', (req, res) => {
  const enabled = isPaystackConfigured();
  const keyStatus = getPaystackKeyStatus();
  res.status(200).json({
    success: true,
    data: {
      enabled,
      publicKey: enabled ? process.env.PAYSTACK_PUBLIC_KEY : null,
      currency: 'GHS',
      mode: keyStatus.mode,
      keysMatched: keyStatus.matched,
    },
  });
});

// @desc    Initialize Paystack payment (logged-in customers)
// @route   POST /api/payments/initialize
// @access  Private
router.post('/initialize', protect, [
  body('items').isArray({ min: 1 }),
  body('shippingAddress.fullName').trim().notEmpty(),
  body('shippingAddress.phone').trim().notEmpty(),
  body('shippingAddress.city').trim().notEmpty(),
  body('shippingAddress.region').trim().notEmpty(),
  body('totalAmount').isNumeric(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const addressError = validateShippingAddress(req.body.shippingAddress);
    if (addressError) {
      return res.status(400).json({ success: false, message: addressError });
    }

    if (!isPaystackConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Online card payment is not configured yet. Please use WhatsApp checkout.',
        code: 'PAYSTACK_NOT_CONFIGURED',
      });
    }

    const { items, shippingAddress, totalAmount } = req.body;

    const pricing = await validateOrderItems(items);
    if (!pricing.ok) {
      return res.status(400).json({ success: false, message: pricing.message });
    }
    if (!totalsMatch(pricing.totalAmount, totalAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Order total does not match product prices. Please refresh and try again.',
      });
    }

    const amount = Math.round(pricing.totalAmount * 100);

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Order total is too low for card payment',
      });
    }

    let order = await findReusablePaystackOrder(req.user.id, pricing);
    let isNewOrder = false;

    if (order) {
      order.shippingAddress = shippingAddress;
      await order.save();
    } else {
      isNewOrder = true;
      order = await ShopOrder.create({
        customer: req.user.id,
        items: pricing.items,
        shippingAddress,
        totalAmount: pricing.totalAmount,
        channel: 'paystack',
        status: 'pending',
        paymentStatus: 'pending',
        statusHistory: [{
          status: 'pending',
          changedAt: new Date(),
          changedBy: req.user.id,
          note: 'Paystack checkout started',
        }],
      });
    }

    await cancelSupersededPaystackOrders(req.user.id, pricing, order._id);

    if (isNewOrder) {
      queueAdminNewOrder(order);
    }

    const reference = `HD-${order._id}-${Date.now()}`;
    const callbackUrl = `${frontendBaseUrl()}/payment/callback`;

    const paystack = await paystackRequest('/transaction/initialize', {
      method: 'POST',
      body: {
        email: req.user.email,
        amount,
        currency: 'GHS',
        reference,
        callback_url: callbackUrl,
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          customerId: req.user.id.toString(),
        },
      },
    });

    if (!paystack.status || !paystack.data?.reference) {
      await ShopOrder.findByIdAndDelete(order._id);
      return res.status(502).json({
        success: false,
        message: paystack.message || 'Could not initialize Paystack payment',
      });
    }

    order.paystackReference = paystack.data.reference;
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        reference: paystack.data.reference,
        publicKey: process.env.PAYSTACK_PUBLIC_KEY,
        amount,
        orderId: order._id.toString(),
        authorizationUrl: paystack.data.authorization_url,
        callbackUrl,
      },
    });
  } catch (error) {
    console.error('Paystack initialize error:', error);
    const message =
      error.code === 'PAYSTACK_NOT_CONFIGURED'
        ? 'Online card payment is not configured yet. Please use WhatsApp checkout.'
        : 'Could not start Paystack payment';
    res.status(500).json({ success: false, message, code: error.code });
  }
});

// @desc    Verify Paystack payment
// @route   GET /api/payments/verify/:reference
// @access  Private
router.get('/verify/:reference', protect, async (req, res) => {
  try {
    const { reference } = req.params;
    const order = await ShopOrder.findOne({
      paystackReference: reference,
      customer: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found for this payment' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        data: { order },
      });
    }

    const result = await verifyTransactionReference(reference);

    if (!result.ok) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({
        success: false,
        message: result.message || 'Payment was not successful',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified',
      data: { order: result.order },
    });
  } catch (error) {
    console.error('Paystack verify error:', error);
    const message =
      error.code === 'PAYSTACK_NOT_CONFIGURED'
        ? 'Paystack is not configured on the server'
        : 'Could not verify payment';
    res.status(500).json({ success: false, message });
  }
});

/** Webhook handler — mount with express.raw() in server.js */
async function paystackWebhookHandler(req, res) {
  try {
    const signature = req.headers['x-paystack-signature'];
    if (!verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === 'charge.success') {
      const reference = event.data?.reference;
      if (reference) {
        await verifyTransactionReference(reference);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(500).json({ success: false });
  }
}

module.exports = router;
module.exports.paystackWebhookHandler = paystackWebhookHandler;
