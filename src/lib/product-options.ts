/** Common color preferences when product has no fixed colorways in catalog */
export const COLOR_PREFERENCES = [
  'Black',
  'White',
  'Army green',
  'Grey',
  'Navy',
  'Other (specify below)',
] as const;

export const PAYSTACK_BRAND = {
  primary: '#00C3F7',
  primaryHover: '#00A8D9',
  text: '#011B33',
} as const;

export function resolveColorPreference(choice: string, custom: string): string {
  if (!choice) return '';
  if (choice.includes('Other') || choice === 'Other (specify below)') {
    return custom.trim() || 'Other (not specified)';
  }
  return choice;
}
