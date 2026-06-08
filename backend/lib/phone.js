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

module.exports = { normalizePhoneForSms };
