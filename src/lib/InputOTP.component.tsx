import React, { forwardRef, useMemo } from "react";

import { Input, InputProps } from "antd";
import cx from "classnames";

import { useInputOTP } from "./InputOTP.hooks";
import type { InputOTPProps } from "./InputOTP.types";
import "./InputOTP.styles.css";

const InputOTPSingle: React.FC<InputProps> = ({ className, ...rest }) => {
  return (
    <Input
      className={cx("input-otp__field", className)}
      maxLength={1}
      {...rest}
    />
  );
};

const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      className,
      disabled,
      inputClassName,
      length = 6,
      placeholder,
      onChange,
      inputRegex,
      inputType = "all",
      value,
      ...rest
    },
    ref
  ) => {
    const {
      handleChange,
      handleFocus,
      handleKeyDown,
      handleKeyPress,
      otpValue,
    } = useInputOTP({ inputRegex, inputType, onChange });

    const makeLength = useMemo(() => {
      if (length < 2) return 2;
      if (length > 16) return 16;
      return length;
    }, [length]);

    return (
      <div className={cx("input-otp", className)} ref={ref}>
        {Array(makeLength)
          .fill(null)
          .map((_, idx) => (
            <InputOTPSingle
              key={idx}
              onFocus={handleFocus}
              // onChange won't triggered when the field
              // filled with same value, therefore using
              // onInput.
              onInput={handleChange}
              onKeyDown={handleKeyDown}
              onKeyPress={handleKeyPress}
              className={inputClassName}
              disabled={disabled}
              placeholder={
                placeholder?.length === 1 ? placeholder : placeholder?.[idx]
              }
              value={value?.[idx] || otpValue.current?.[idx]}
              {...rest}
              // @Override
              id={`antd-input-otp-${idx}`}
            />
          ))}
      </div>
    );
  }
);

export default InputOTP;
