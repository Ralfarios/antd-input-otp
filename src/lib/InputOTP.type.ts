import type { FormInstance, InputProps, InputRef } from 'antd';

type TInputType<T extends 'custom' | 'standard'> = T extends 'custom'
  ? 'custom'
  :
      | 'numeric'
      | 'alphabet'
      | 'symbol'
      | 'alphabet-symbol'
      | 'alphabet-numeric'
      | 'numeric-symbol'
      | 'all';

type TInputRegex<T extends 'custom' | 'standard'> = T extends 'custom'
  ? string | RegExp
  : never;

export type TAutoSubmit<T extends 'uncontrolled' | 'controlled'> =
  T extends 'uncontrolled' ? FormInstance : (value: string[]) => void;

interface BaseInputOTPProps
  extends Omit<
    InputProps,
    'className' | 'form' | 'onChange' | 'style' | 'value'
  > {
  /**
   * Autofocus for the first field of OTP. If you want to make the second or third or even the last field autofocused, use `inputRef`.
   *
   * @default
   * false
   */
  autoFocus?: boolean;
  /**
   * Autosubmit when the value is fully filled.
   *
   * There is 2 ways to use this feature, the first one if you are using uncontrolled field (with antd form), add the form instance from antd to the value.
   *
   * If you are using controllable field, just add the submit function for the value, it will trigger automatically after every field filled.
   *
   * Keep it empty or `null` if you don't use this feature.
   *
   * @default
   * null
   */
  autoSubmit?: TAutoSubmit<'uncontrolled'> | TAutoSubmit<'controlled'> | null;
  disabled?: boolean;
  /** Classes for styling input field. */
  inputClassName?: InputProps['className'];
  /**
   * Reference for the input fields. Inside of the `current` should be array of `InputRef` from antd.
   *
   * @default
   * null
   */
  inputRef?: React.MutableRefObject<InputRef[] | null[] | null>;
  /** Inline style input field. */
  inputStyle?: InputProps['style'];
  /**
   * There are 8 input types of validation including `custom` validation based on your own regex.
   *
   * Selecting `all` as the value will invalidate the field and every character (alphabet, numeric and symbol) can be filled.
   *
   * @default
   * 'all'
   */
  inputType?: unknown;
  /**
   * If you choose `custom` as `inputType`, `inputRegex` will be mandatory.
   *
   * Wrote your validation with regex here.
   *
   * @example
   * ```tsx
   * <InputOTP inputType="custom" inputRegex={/[^0-9]/} placeholder="With Regex" />
   * <InputOTP inputType="custom" inputRegex={new RegExp('[^0-9]')} placeholder="With Regex Class" />
   * <InputOTP inputType="custom" inputRegex="[^0-9]" placeholder="With string" />
   * ```
   */
  inputRegex?: unknown;
  /**
   * Determine the total of your fields.
   *
   * Keep in mind the minimum value is `2` and the maximum value is `16`.
   * The length will stay on the limit if you fill it outside the limit.
   *
   * @default
   * 6
   */
  length?: number;
  /**
   * Determine whether the input is still focused or not when every field is filled.
   *
   * @default
   * false
   */
  isPreserveFocus?: boolean;
  onChange?: (value: string[]) => void;
  /**
   * Placeholder for each field. When the value is only **one character**, it will apply to **all fields with the same value**. But, if you want to keep it **unique fir each field**, you must **input the characters with the length same as the field**.
   *
   * @example
   * ```tsx
   * <InputOTP placeholder="x" />
   * <InputOTP length={4} placeholder="X-X-" />
   * ```
   */
  placeholder?: string;
  value?: string[] | null;
  /** Classes for styling input wrapper. */
  wrapperClassName?: string;
  /** Inline style input wrapper. */
  wrapperStyle?: React.CSSProperties;
}

interface CustomInputType extends BaseInputOTPProps {
  inputType: TInputType<'custom'>;
  inputRegex: TInputRegex<'custom'>;
}

interface StandardInputType extends BaseInputOTPProps {
  inputType?: TInputType<'standard'>;
  inputRegex?: TInputRegex<'standard'>;
}

export type InputOTPProps = StandardInputType | CustomInputType;

export interface UseInputOTPProps {
  autoSubmit: InputOTPProps['autoSubmit'];
  fieldLength: NonNullable<InputOTPProps['length']>;
  inputRegex: InputOTPProps['inputRegex'];
  inputType: NonNullable<InputOTPProps['inputType']>;
  isPreserveFocus: InputOTPProps['isPreserveFocus'];
  onChange: InputOTPProps['onChange'];
  value: InputOTPProps['value'];
}

// #region Type for Utils
export type TGetSibling = Record<
  'nextTarget' | 'prevTarget',
  (EventTarget & HTMLInputElement) | null
>;

type TIsNotTheCharacterProps = {
  inputType: NonNullable<InputOTPProps['inputType']>;
  inputRegex: InputOTPProps['inputRegex'];
  value: string;
};

export type TIsNotTheCharacter = ({
  inputType,
  inputRegex,
  value,
}: TIsNotTheCharacterProps) => boolean;
// #endregion
