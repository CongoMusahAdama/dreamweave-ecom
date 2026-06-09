const { isMnotifyConfigured, sendTransactionalSms } = require('./mnotify');
const { formatPhoneForMnotify } = require('./phone');
const { publicSiteUrl } = require('./publicSiteUrl');

async function safeSend(label, fn) {
  try {
    await fn();
  } catch (err) {
    if (err.code === 'MNOTIFY_NOT_CONFIGURED') {
      console.warn(`[notify] ${label} skipped — Mnotify not configured`);
      return;
    }
    console.error(`[notify] ${label} failed:`, err.message);
  }
}

/** SMS when a customer registers successfully */
async function notifyWelcomeSms(user) {
  if (!isMnotifyConfigured()) return;

  await safeSend('welcome sms', async () => {
    const phone = formatPhoneForMnotify(user.phone);
    if (!phone) return;

    const name = user.name || 'there';
    const shopUrl = publicSiteUrl();
    const sms = `HARV DREAMS: Welcome ${name}! Your account is ready. Shop at ${shopUrl}`;

    await sendTransactionalSms({ recipient: phone, content: sms.slice(0, 480) });
  });
}

function queueWelcomeSms(user) {
  setImmediate(() => notifyWelcomeSms(user));
}

module.exports = {
  notifyWelcomeSms,
  queueWelcomeSms,
};
