const User = require('../models/User');
const ShopOrder = require('../models/ShopOrder');
const { isBrevoConfigured, sendTransactionalEmail, sendTransactionalSms } = require('./brevo');
const { normalizePhoneForSms } = require('./phone');

const STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_SMS = {
  pending: 'We received your order and are reviewing it.',
  confirmed: 'Your order is confirmed. Thank you for shopping with HARV DREAMS.',
  processing: 'Your order is being prepared.',
  shipped: 'Your order has shipped and is on the way.',
  delivered: 'Your order has been delivered. Enjoy your HARV piece.',
  cancelled: 'Your order was cancelled. Contact us if you need help.',
};

function adminNotifyEmail() {
  return process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || null;
}

function formatGhs(amount) {
  return `GHS ${Number(amount || 0).toLocaleString('en-GH', { maximumFractionDigits: 2 })}`;
}

function itemsText(items = []) {
  return items
    .map((item) => {
      const color = item.colorPreference ? ` · ${item.colorPreference}` : '';
      return `• ${item.name} (${item.size}) x${item.quantity} — ${item.price}${color}`;
    })
    .join('\n');
}

function itemsHtml(items = []) {
  return items
    .map((item) => {
      const color = item.colorPreference ? ` · ${item.colorPreference}` : '';
      return `<li><strong>${item.name}</strong> (${item.size}) × ${item.quantity} — ${item.price}${color}</li>`;
    })
    .join('');
}

function deliveryText(addr = {}) {
  if (!addr) return '—';
  const method = addr.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery';
  const lines = [
    method,
    addr.fullName,
    addr.phone,
    addr.deliveryMethod === 'pickup'
      ? addr.pickupStation
      : [addr.street, addr.city, addr.region, addr.country].filter(Boolean).join(', '),
  ].filter(Boolean);
  return lines.join('\n');
}

async function loadOrder(orderOrId) {
  if (!orderOrId) return null;
  if (orderOrId.items && orderOrId.orderNumber) {
    if (orderOrId.customer?.email) return orderOrId;
    return ShopOrder.findById(orderOrId._id).populate('customer', 'name email phone');
  }
  return ShopOrder.findById(orderOrId).populate('customer', 'name email phone');
}

function customerEmail(order) {
  return order.customer?.email || null;
}

function customerPhone(order) {
  return order.shippingAddress?.phone || order.customer?.phone || null;
}

function customerName(order) {
  return order.shippingAddress?.fullName || order.customer?.name || 'Customer';
}

async function safeSend(label, fn) {
  try {
    await fn();
  } catch (err) {
    if (err.code === 'BREVO_NOT_CONFIGURED') {
      console.warn(`[notify] ${label} skipped — Brevo not configured`);
      return;
    }
    console.error(`[notify] ${label} failed:`, err.message);
  }
}

/** Admin email when any new order is placed (WhatsApp or Paystack checkout started) */
async function notifyAdminNewOrder(orderOrId) {
  if (!isBrevoConfigured()) return;

  await safeSend('admin new order', async () => {
    const order = await loadOrder(orderOrId);
    const to = adminNotifyEmail();
    if (!order || !to) return;

    const channel = order.channel === 'paystack' ? 'Paystack' : 'WhatsApp';
    const payment =
      order.channel === 'paystack'
        ? order.paymentStatus === 'paid'
          ? 'Paid'
          : 'Awaiting Paystack payment'
        : 'Awaiting payment (confirm after customer pays)';

    const subject = `New ${channel} order — ${order.orderNumber}`;
    const text = [
      `New order on HARV DREAMS`,
      ``,
      `Order: ${order.orderNumber}`,
      `Order ID: ${order._id}`,
      `Channel: ${channel}`,
      `Payment: ${payment}`,
      `Total: ${formatGhs(order.totalAmount)}`,
      `Status: ${STATUS_LABEL[order.status] || order.status}`,
      ``,
      `Customer: ${customerName(order)}`,
      `Email: ${customerEmail(order) || '—'}`,
      `Phone: ${customerPhone(order) || '—'}`,
      ``,
      `Items:`,
      itemsText(order.items),
      ``,
      `Delivery / pickup:`,
      deliveryText(order.shippingAddress),
    ].join('\n');

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;color:#111">
        <h2 style="font-size:14px;letter-spacing:0.12em;text-transform:uppercase">New ${channel} order</h2>
        <p><strong>${order.orderNumber}</strong> · ${formatGhs(order.totalAmount)}</p>
        <p style="font-size:12px;color:#555">
          Order ID: ${order._id}<br/>
          Payment: ${payment}<br/>
          Status: ${STATUS_LABEL[order.status] || order.status}
        </p>
        <p style="font-size:12px"><strong>Customer</strong><br/>
          ${customerName(order)}<br/>
          ${customerEmail(order) || ''}<br/>
          ${customerPhone(order) || ''}
        </p>
        <ul style="font-size:12px;padding-left:18px">${itemsHtml(order.items)}</ul>
        <pre style="font-size:11px;background:#f6f6f6;padding:12px;white-space:pre-wrap">${deliveryText(order.shippingAddress)}</pre>
        <p style="font-size:11px;color:#888">Open Admin → Orders to confirm payment or update status.</p>
      </div>`;

    await sendTransactionalEmail({
      to: { email: to, name: 'HARV Admin' },
      subject,
      textContent: text,
      htmlContent: html,
    });
  });
}

/** Admin email when Paystack payment succeeds */
async function notifyAdminPaymentReceived(orderOrId) {
  if (!isBrevoConfigured()) return;

  await safeSend('admin payment received', async () => {
    const order = await loadOrder(orderOrId);
    const to = adminNotifyEmail();
    if (!order || !to) return;

    const subject = `Payment received — ${order.orderNumber}`;
    const text = [
      `Paystack payment confirmed.`,
      ``,
      `Order: ${order.orderNumber}`,
      `Order ID: ${order._id}`,
      `Total: ${formatGhs(order.totalAmount)}`,
      `Customer: ${customerName(order)}`,
      `Reference: ${order.paystackReference || '—'}`,
    ].join('\n');

    await sendTransactionalEmail({
      to: { email: to, name: 'HARV Admin' },
      subject,
      textContent: text,
      htmlContent: `<p><strong>Payment received</strong> for ${order.orderNumber} (${formatGhs(order.totalAmount)}).</p><p>Customer: ${customerName(order)}</p>`,
    });
  });
}

/** Customer email + SMS on every order status change */
async function notifyCustomerOrderStatus(orderOrId, previousStatus) {
  if (!isBrevoConfigured()) return;

  await safeSend('customer status change', async () => {
    const order = await loadOrder(orderOrId);
    if (!order) return;

    const status = order.status;
    if (previousStatus === status) return;

    const label = STATUS_LABEL[status] || status;
    const smsLine = STATUS_SMS[status] || `Your order status is now ${label}.`;
    const email = customerEmail(order);
    const phone = normalizePhoneForSms(customerPhone(order));
    const name = customerName(order);

    const subject = `HARV DREAMS — Order ${order.orderNumber} is ${label}`;
    const text = [
      `Hi ${name},`,
      ``,
      `Your order ${order.orderNumber} is now: ${label}.`,
      smsLine,
      ``,
      `Total: ${formatGhs(order.totalAmount)}`,
      `Track your order in your HARV account.`,
    ].join('\n');

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;color:#111">
        <p>Hi ${name},</p>
        <p>Your order <strong>${order.orderNumber}</strong> is now <strong>${label}</strong>.</p>
        <p style="font-size:13px;color:#444">${smsLine}</p>
        <p style="font-size:12px;color:#666">Total: ${formatGhs(order.totalAmount)}</p>
        <p style="font-size:11px;color:#888">Sign in to your account to view order details.</p>
      </div>`;

    const tasks = [];
    if (email) {
      tasks.push(
        sendTransactionalEmail({
          to: { email, name },
          subject,
          textContent: text,
          htmlContent: html,
        })
      );
    }

    if (phone) {
      const sms = `HARV DREAMS: Order ${order.orderNumber} — ${label}. ${smsLine}`;
      tasks.push(sendTransactionalSms({ recipient: phone, content: sms.slice(0, 480) }));
    }

    if (!tasks.length) {
      console.warn(`[notify] No customer email/phone for order ${order.orderNumber}`);
      return;
    }

    await Promise.all(tasks);
  });
}

/** Fire-and-forget wrappers for route handlers */
function queueAdminNewOrder(order) {
  setImmediate(() => notifyAdminNewOrder(order));
}

function queueAdminPaymentReceived(order) {
  setImmediate(() => notifyAdminPaymentReceived(order));
}

function queueCustomerStatusChange(order, previousStatus) {
  setImmediate(() => notifyCustomerOrderStatus(order, previousStatus));
}

module.exports = {
  isBrevoConfigured,
  notifyAdminNewOrder,
  notifyAdminPaymentReceived,
  notifyCustomerOrderStatus,
  queueAdminNewOrder,
  queueAdminPaymentReceived,
  queueCustomerStatusChange,
};
