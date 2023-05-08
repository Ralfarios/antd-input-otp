import type { UseInputOTPProps } from "./InputOTP.types";

export const kRegexDictionary: Record<
  NonNullable<Exclude<UseInputOTPProps["inputType"], "all" | "custom">>,
  RegExp
> = {
  alphabet: /[^A-Za-z]/,
  "alphabet-numeric": /[\W_]/,
  "alphabet-symbol": /\d/,
  numeric: /\D/,
  "numeric-symbol": /[A-Za-z]/,
  symbol: /[\W_]/,
};
