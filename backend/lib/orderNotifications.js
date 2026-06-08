const User = require('../models/User');
const ShopOrder = require('../models/ShopOrder');
const { isBrevoConfigured, sendTransactionalEmail, sendTransactionalSms } = require('./brevo');
const { harvEmailLayout } = require('./emailTemplate');
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

    const html = harvEmailLayout({
      title: `New ${channel} order`,
      preheader: `${order.orderNumber} · ${formatGhs(order.totalAmount)}`,
      bodyHtml: `
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;">${order.orderNumber}</p>
        <p style="margin:0 0 20px;font-size:13px;color:#444;">${formatGhs(order.totalAmount)}</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;font-size:12px;color:#555;">
          <tr><td style="padding:4px 0;"><strong>Payment</strong></td><td style="padding:4px 0;">${payment}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Status</strong></td><td style="padding:4px 0;">${STATUS_LABEL[order.status] || order.status}</td></tr>
        </table>
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#111;">Customer</p>
        <p style="margin:0 0 20px;font-size:12px;line-height:1.6;color:#444;">
          ${customerName(order)}<br/>
          ${customerEmail(order) || '—'}<br/>
          ${customerPhone(order) || '—'}
        </p>
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#111;">Items</p>
        <ul style="margin:0 0 20px;padding-left:18px;font-size:12px;line-height:1.7;color:#444;">${itemsHtml(order.items)}</ul>
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#111;">Delivery</p>
        <p style="margin:0 0 20px;font-size:11px;line-height:1.6;color:#555;background:#f6f6f6;padding:12px;border:1px solid #e8e8e8;white-space:pre-wrap;">${deliveryText(order.shippingAddress)}</p>
        <p style="margin:0;font-size:11px;color:#888;">Open Admin → Orders to confirm payment or update status.</p>`,
    });

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
      htmlContent: harvEmailLayout({
        title: 'Payment received',
        preheader: `${order.orderNumber} · ${formatGhs(order.totalAmount)}`,
        bodyHtml: `
          <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#111;">
            Paystack payment confirmed for <strong>${order.orderNumber}</strong>.
          </p>
          <p style="margin:0 0 8px;font-size:13px;color:#444;">Total: ${formatGhs(order.totalAmount)}</p>
          <p style="margin:0;font-size:12px;color:#555;">Customer: ${customerName(order)}</p>`,
      }),
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

    const accountUrl = `${(process.env.FRONTEND_URL || 'https://harvdreams.com').replace(/\/$/, '')}/account`;
    const html = harvEmailLayout({
      title: `Order ${label}`,
      preheader: `${order.orderNumber} is now ${label}`,
      bodyHtml: `
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#111;">Hi ${name},</p>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#111;">
          Your order <strong>${order.orderNumber}</strong> is now <strong>${label}</strong>.
        </p>
        <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#444;">${smsLine}</p>
        <p style="margin:0 0 24px;font-size:12px;color:#666;">Total: ${formatGhs(order.totalAmount)}</p>
        <a href="${accountUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;padding:14px 24px;">View your order</a>`,
    });

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
