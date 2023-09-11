import type { InputProps, InputRef } from "antd";
import type { FormInstance } from "antd/es/form/hooks/useForm";

interface BaseInputOTPProps
  extends Omit<InputProps, "value" | "onChange" | "className" | "style"> {
  /**
   * Autofocus for the first field of OTP. If you want to make the second or third or even the last field autofocused, use `inputRef`.
   */
  autoFocus?: boolean;
  /**
   * WARNING -- EXPERIMENTAL
   * -----------------------
   * Auto submit when the value is fully filled.
   *
   * This feature is still under development, you can use this only for uncontrolled fields, such as antd form.
   * > DO NOT USE IT WITH `useState`.
   *
   * The default value is `false`.
   */
  __EXPERIMENTAL_autoSubmit?: FormInstance;
  disabled?: boolean;
  /** Classes for styling input field. */
  inputClassName?: InputProps["className"];
  /** Inline style input field. */
  inputStyle?: InputProps["style"];
  /**
   * Reference for the input fields. Inside of the `current` should be array of `InputRef` from antd.
   */
  inputRef?: InputOTPRef;
  /**
   * Determine the total of your fields.
   *
   * Keep in mind the minimum value is `2` and the maximum value is `16`.
   * The length will stay on the limit if you fill it outside the limit.
   *
   * The default value is `6`.
   */
  length?: number;
  /**
   * Placeholder for each field. When the value is only **one character**. It will apply to **all fields with the same value**.
   *
   * For example, if you put `"x"`, all fields will have `x` as placeholder.
   *
   * If you want to keep it **unique for each field**, you must **input the characters with the length same as the field**.
   *
   * For example, if you have 6 fields and want to keep the placeholder unique to each field, the value should be `"x_x_x_"`.
   */
  placeholder?: string;
  onChange?: (value: string[]) => void;
  value?: string[] | null;
  /** Classes for styling input wrapper. */
  wrapperClassName?: string;
  /** Inline style input wrapper. */
  wrapperStyle?: React.CSSProperties;
}

interface BaseInputType extends BaseInputOTPProps {
  /**
   * There are 8 input types of validation including `custom` validation based on your own regex.
   *
   * Selecting `all` as the value will invalidate the field and every character (alphabet, numeric and symbol) can be filled.
   *
   * The default value is unvalidated which means `all`.
   */
  inputType?:
    | "numeric"
    | "alphabet"
    | "symbol"
    | "alphabet-symbol"
    | "alphabet-numeric"
    | "numeric-symbol"
    | "all";
  /**
   * If you choose `custom` as `inputType`, `inputRegex` will be mandatory.
   *
   * Wrote your validation with regex here.
   *
   * For example:
   * ```tsx
   * <InputOTP inputType="custom" inputRegex={/[^0-9]/} placeholder="With Regex" />
   * <InputOTP inputType="custom" inputRegex={new RegExp('[^0-9]')} placeholder="With Regex Class" />
   * <InputOTP inputType="custom" inputRegex="[^0-9]" placeholder="With string" />
   * ```
   */
  inputRegex?: never;
}

interface CustomInputType extends BaseInputOTPProps {
  /**
   * There are 8 input types of validation including `custom` validation based on your own regex.
   *
   * Selecting `all` as the value will invalidate the field and every character (alphabet, numeric and symbol) can be filled.
   *
   * The default value is unvalidated which means `all`.
   */
  inputType: "custom";
  /**
   * If you choose `custom` as `inputType`, `inputRegex` will be mandatory.
   *
   * Wrote your validation with regex here.
   *
   * For example:
   * ```tsx
   * <InputOTP inputType="custom" inputRegex={/[^0-9]/} placeholder="With Regex" />
   * <InputOTP inputType="custom" inputRegex={new RegExp('[^0-9]')} placeholder="With Regex Class" />
   * <InputOTP inputType="custom" inputRegex="[^0-9]" placeholder="With string" />
   * ```
   */
  inputRegex: string | RegExp;
}

export interface UseInputOTPProps {
  autoSubmit?: InputOTPProps["__EXPERIMENTAL_autoSubmit"];
  inputType: InputOTPProps["inputType"];
  inputRegex: InputOTPProps["inputRegex"];
  onChange: InputOTPProps["onChange"];
  length: NonNullable<InputOTPProps["length"]>;
}

export type InputOTPProps = BaseInputType | CustomInputType;

export type InputOTPRef = React.MutableRefObject<InputRef[] | null[] | null>;
