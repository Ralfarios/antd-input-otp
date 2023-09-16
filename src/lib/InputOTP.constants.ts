import type { UseInputOTPProps } from './InputOTP.types';

export const kRegexDictionary: Record<
  NonNullable<Exclude<UseInputOTPProps['inputType'], 'all' | 'custom'>>,
  RegExp
> = {
  alphabet: /[^A-Za-z]/,
  'alphabet-numeric': /[\W_]/,
  'alphabet-symbol': /[\d]|[^\S]/,
  numeric: /\D/,
  'numeric-symbol': /[A-Za-z]|[^\S]/,
  symbol: /[^\W_]|[^\S]/,
};
