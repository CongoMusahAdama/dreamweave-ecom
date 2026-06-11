const crypto = require('crypto');
const ShopOrder = require('../models/ShopOrder');
const {
  queueAdminPaymentReceived,
  queueCustomerStatusChange,
} = require('./orderNotifications');
const { decrementStockForPaidOrder } = require('./inventory');

function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_PUBLIC_KEY);
}

function paystackKeyMode(key, prefix) {
  if (!key) return 'missing';
  if (key.startsWith(`${prefix}_live_`)) return 'live';
  if (key.startsWith(`${prefix}_test_`)) return 'test';
  return 'unknown';
}

function getPaystackKeyStatus() {
  const publicMode = paystackKeyMode(process.env.PAYSTACK_PUBLIC_KEY, 'pk');
  const secretMode = paystackKeyMode(process.env.PAYSTACK_SECRET_KEY, 'sk');
  const matched = publicMode !== 'missing' && publicMode === secretMode;
  return { publicMode, secretMode, matched, mode: matched ? publicMode : 'mismatch' };
}

function frontendBaseUrl() {
  return (process.env.FRONTEND_URL || 'http://localhost:8080').replace(/\/$/, '');
}

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

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return hash === signature;
}

async function markOrderPaidByReference(reference) {
  const order = await ShopOrder.findOne({ paystackReference: reference });
  if (!order) return null;
  if (order.paymentStatus === 'paid') return order;

  const previousStatus = order.status;

  order.paymentStatus = 'paid';
  if (order.status === 'pending') {
    order.status = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      changedAt: new Date(),
      note: 'Payment received via Paystack',
    });
  }
  await order.save();

  if (!order.stockDeducted) {
    try {
      await decrementStockForPaidOrder(order);
      order.stockDeducted = true;
      await order.save();
    } catch (err) {
      console.error('[inventory] Failed to decrement stock for paid order:', err.message);
    }
  }

  queueAdminPaymentReceived(order);
  if (previousStatus !== order.status) {
    queueCustomerStatusChange(order, previousStatus);
  }

  return order;
}

async function chargeMobileMoney({ email, amount, reference, phone, provider, metadata }) {
  return paystackRequest('/charge', {
    method: 'POST',
    body: {
      email,
      amount,
      currency: 'GHS',
      reference,
      mobile_money: {
        phone,
        provider,
      },
      metadata,
    },
  });
}

async function verifyTransactionReference(reference) {
  const paystack = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
  const txStatus = paystack.data?.status;
  if (!paystack.status || txStatus !== 'success') {
    return { ok: false, paystack, status: txStatus };
  }

  const order = await ShopOrder.findOne({ paystackReference: reference });
  if (order) {
    const expectedKobo = Math.round(Number(order.totalAmount) * 100);
    const paidKobo = Number(paystack.data?.amount);
    if (Number.isFinite(expectedKobo) && Number.isFinite(paidKobo) && paidKobo !== expectedKobo) {
      return { ok: false, paystack, message: 'Payment amount does not match order total' };
    }
  }

  const paidOrder = await markOrderPaidByReference(reference);
  return { ok: true, order: paidOrder, paystack };
}

module.exports = {
  isPaystackConfigured,
  getPaystackKeyStatus,
  frontendBaseUrl,
  paystackRequest,
  chargeMobileMoney,
  verifyWebhookSignature,
  markOrderPaidByReference,
  verifyTransactionReference,
};
