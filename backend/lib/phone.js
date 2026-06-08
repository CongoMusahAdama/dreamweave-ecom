/**
 * Normalize phone numbers for Brevo SMS (digits only, no +).
 * Supports international numbers and local Ghana format (0XXXXXXXXX → 233XXXXXXXXX).
 */
function normalizePhoneForSms(phone, defaultCountryCode = '233') {
  if (!phone || typeof phone !== 'string') return null;

  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  // Local Ghana mobile: 0XXXXXXXXX (9 digits after 0)
  if (digits.startsWith('0') && digits.length >= 10 && digits.length <= 11) {
    digits = `${defaultCountryCode}${digits.slice(1)}`;
  }

  // Minimum viable international length (country code + subscriber)
  if (digits.length < 10 || digits.length > 15) return null;

  return digits;
}

function isValidPhoneInput(phone) {
  if (!phone || typeof phone !== 'string') return true;
  const trimmed = phone.trim();
  if (!trimmed) return true;
  if (!/^\+?[\d\s-()]{7,20}$/.test(trimmed)) return false;
  return normalizePhoneForSms(trimmed) !== null;
}

module.exports = { normalizePhoneForSms, isValidPhoneInput };
