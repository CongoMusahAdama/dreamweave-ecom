const express = require('express');
const { body, validationResult } = require('express-validator');
const ShopOrder = require('../models/ShopOrder');
const { protect } = require('../middleware/auth');
const { validateShippingAddress } = require('../utils/validateShippingAddress');

const router = express.Router();

async function paystackRequest(path, options = {}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    const err = new Error('Paystack is not configured on the server');
    err.code = 'PAYSTACK_NOT_CONFIGURED';
    throw err;
  }

  const res = await fetch(`https://api.paystack.co${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return res.json();
}

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

    const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      return res.status(503).json({
        success: false,
        message: 'Online card payment is not configured yet. Please use WhatsApp checkout.',
      });
    }

    const { items, shippingAddress, totalAmount } = req.body;
    const amount = Math.round(Number(totalAmount) * 100);

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Order total is too low for card payment',
      });
    }

    const order = await ShopOrder.create({
      customer: req.user.id,
      items,
      shippingAddress,
      totalAmount: Number(totalAmount),
      channel: 'paystack',
      status: 'pending',
      paymentStatus: 'pending',
    });

    const paystack = await paystackRequest('/transaction/initialize', {
      method: 'POST',
      body: {
        email: req.user.email,
        amount,
        currency: 'GHS',
        reference: `HD-${order._id}-${Date.now()}`,
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
        publicKey,
        amount,
        orderId: order._id.toString(),
        authorizationUrl: paystack.data.authorization_url,
      },
    });
  } catch (error) {
    console.error('Paystack initialize error:', error);
    const message =
      error.code === 'PAYSTACK_NOT_CONFIGURED'
        ? 'Online card payment is not configured yet. Please use WhatsApp checkout.'
        : 'Could not start Paystack payment';
    res.status(500).json({ success: false, message });
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

    const paystack = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);

    if (!paystack.status || paystack.data?.status !== 'success') {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({
        success: false,
        message: 'Payment was not successful',
      });
    }

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified',
      data: { order },
    });
  } catch (error) {
    console.error('Paystack verify error:', error);
    res.status(500).json({ success: false, message: 'Could not verify payment' });
  }
});

module.exports = router;
