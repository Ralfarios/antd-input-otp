import { forwardRef, memo } from 'react';

import { Input, type InputProps, type InputRef } from 'antd';
import cx from 'classnames';

import { useInputOTP } from './InputOTP.hook';
import type { InputOTPProps } from './InputOTP.type';
import { makeLength } from './InputOTP.util';

import './InputOTP.style.css';

const SingleInputOTP = memo(
  forwardRef<InputRef, InputProps>(({ className, ...rest }, ref) => {
    return (
      <Input
        className={cx('input-otp__field', className)}
        ref={ref}
        maxLength={1}
        {...rest}
      />
    );
  }),
);

const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>((props, ref) => {
  // #region Component's props
  const {
    autoFocus = false,
    autoSubmit = null,
    disabled,
    id,
    inputClassName,
    inputRef = null,
    inputRegex,
    inputStyle,
    inputType = 'all',
    isPreserveFocus = false,
    length = 6,
    placeholder = '',
    onChange,
    value,
    wrapperClassName,
    wrapperStyle,
    ...rest
  } = props;
  // #endregion

  const fieldLength = makeLength(length);

  // #region Helper Functions
  const {
    handleFocus,
    handleInput,
    handleKeyDown,
    handleKeyPress,
    handlePaste,
    otp,
  } = useInputOTP({
    autoSubmit,
    fieldLength,
    inputRegex,
    inputType,
    isPreserveFocus,
    length: fieldLength,
    onChange,
    value,
  });
  // #endregion

  return (
    <div
      className={cx('input-otp', wrapperClassName)}
      data-testid="inputOTP"
      id={id}
      ref={ref}
      style={wrapperStyle}>
      {Array(fieldLength)
        .fill(null)
        .map((_, idx) => {
          return (
            <SingleInputOTP
              autoFocus={autoFocus && idx === 0}
              className={inputClassName}
              disabled={disabled}
              key={`input-otp-${idx}`}
              onFocus={handleFocus}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              ref={(r) => {
                if (inputRef) {
                  if (inputRef.current === null) {
                    inputRef.current = [];
                  }
                  inputRef.current[idx] = r;
                }
              }}
              style={inputStyle}
              value={value?.[idx] || otp?.[idx]}
              placeholder={
                placeholder?.length === 1 ? placeholder : placeholder?.[idx]
              }
              {...rest}
            />
          );
        })}
    </div>
  );
});

export default InputOTP;
