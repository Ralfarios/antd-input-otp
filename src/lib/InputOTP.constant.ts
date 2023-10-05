import type { InputOTPProps } from './InputOTP.type';

export const kRegexDictionary: Record<
  NonNullable<Exclude<InputOTPProps['inputType'], 'all' | 'custom'>>,
  RegExp
> = {
  alphabet: /[^A-Za-z]/,
  'alphabet-numeric': /[\W_]/,
  'alphabet-symbol': /[\d]|[^\S]/,
  numeric: /\D/,
  'numeric-symbol': /[A-Za-z]|[^\S]/,
  symbol: /[^\W_]|[^\S]/,
};
