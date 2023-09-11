import React from "react";

import { Input, InputProps, InputRef } from "antd";
import cx from "classnames";

import { useInputOTP } from "./InputOTP.hooks";
import type { InputOTPProps } from "./InputOTP.types";

import "./InputOTP.styles.css";

const InputOTPSingle = React.forwardRef<InputRef, InputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <Input
        className={cx("input-otp__field", className)}
        maxLength={1}
        ref={ref}
        {...rest}
      />
    );
  }
);

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      __EXPERIMENTAL_autoSubmit,
      autoFocus,
      disabled,
      id,
      inputClassName,
      inputRef = null,
      inputRegex,
      inputStyle,
      inputType = "all",
      length = 6,
      onChange,
      placeholder,
      value,
      wrapperClassName,
      wrapperStyle,
      ...rest
    },
    ref
  ) => {
    const makeLength = React.useMemo(() => {
      if (length < 2) return 2;
      if (length > 16) return 16;
      return length;
    }, [length]);

    const {
      handleChange,
      handleFocus,
      handleKeyDown,
      handleKeyPress,
      handlePaste,
      otpValue,
    } = useInputOTP({
      autoSubmit: __EXPERIMENTAL_autoSubmit,
      inputRegex,
      inputType,
      length: makeLength,
      onChange,
    });

    return (
      <div
        className={cx("input-otp", wrapperClassName)}
        id={id}
        ref={ref}
        style={wrapperStyle}
      >
        {Array(makeLength)
          .fill(null)
          .map((_, idx) => {
            return (
              <InputOTPSingle
                autoFocus={autoFocus && idx === 0}
                key={idx}
                onFocus={handleFocus}
                // onChange won't triggered when the field
                // filled with same value, therefore using
                // onInput.
                onInput={handleChange}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                onKeyPress={handleKeyPress}
                ref={(r) => {
                  if (inputRef) {
                    if (inputRef.current === null) {
                      inputRef.current = [];
                    }

                    inputRef.current[idx] = r;
                  }
                }}
                className={inputClassName}
                style={inputStyle}
                disabled={disabled}
                placeholder={
                  placeholder?.length === 1 ? placeholder : placeholder?.[idx]
                }
                value={value?.[idx] || otpValue?.[idx]}
                {...rest}
              />
            );
          })}
      </div>
    );
  }
);

export default InputOTP;
