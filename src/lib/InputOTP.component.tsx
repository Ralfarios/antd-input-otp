import { forwardRef, memo, useCallback, useState } from 'react';

import { Input, type InputProps, type InputRef } from 'antd';
import cx from 'classnames';

import type { InputOTPProps, TAutoSubmit } from './InputOTP.type';
import {
  getCurrentIndex,
  getCurrentInput,
  getSibling,
  isFormInstance,
  isNotTheCharacter,
  makeLength,
} from './InputOTP.util';

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

  const [otp, setOtp] = useState<string[]>([]);
  const fieldLength = makeLength(length);

  // #region Select all value when focused
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      event.currentTarget.select();
    },
    [],
  );
  // #endregion

  // #region Handle changing value
  const handleChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement>,
      onChangeProcess?: (currentValue: string[]) => void,
    ) => {
      if (!value || value.join('').length < 1) setOtp([]);

      const currentIndex = getCurrentIndex(event);
      const newOtpValue = [...(value || [])];
      newOtpValue[currentIndex] = event.currentTarget.value;

      onChangeProcess?.(newOtpValue);
      onChange?.(newOtpValue);

      return newOtpValue;
    },
    [onChange, value],
  );
  // #endregion

  // #region Handle input, auto submit and preserved focus
  const handleInput = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const { nextTarget, prevTarget } = getSibling(event);
      const currentTarget = event.currentTarget;

      const value = handleChange(event);
      const isValueLengthMatch = value.join('').length === fieldLength;

      const { inputType } = event.nativeEvent as InputEvent;
      const isInsertText = inputType === 'insertText';
      const isNotNextTarget = isInsertText && !nextTarget;

      if (isNotNextTarget && autoSubmit && isValueLengthMatch) {
        if (isFormInstance(autoSubmit as TAutoSubmit<'uncontrolled'>))
          (autoSubmit as TAutoSubmit<'uncontrolled'>).submit();
        else (autoSubmit as TAutoSubmit<'controlled'>)(value);
      }

      if (isNotNextTarget && !isPreserveFocus) return currentTarget.blur();
      if (isInsertText) return nextTarget?.select();

      // * This block only work when the value in the field exists.
      if (inputType === 'deleteContentBackward') return prevTarget?.select();
    },
    [autoSubmit, fieldLength, handleChange, isPreserveFocus],
  );
  // #endregion

  // #region Handling disable keys
  // TODO: Implement these on handleKeyDown since onKeyPress will be deprecated.
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event?.key === 'Enter') return;
      if (isNotTheCharacter({ inputRegex, inputType, value: event?.key }))
        return event.preventDefault();
    },
    [inputRegex, inputType],
  );
  // #endregion

  // #region Handling Arrow Left and Right, also Backspace when value is empty
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { nextTarget, prevTarget } = getSibling(event);

      switch (event.key) {
        case 'Backspace':
          if (event.currentTarget.value) break;
        // * This block only work when the value in the field doesn't exist
        // falls through
        case 'ArrowLeft':
          event.preventDefault();
          prevTarget?.select();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextTarget?.select();
          break;
        default:
          break;
      }
    },
    [],
  );
  // #endregion

  // #region Handling Paste value
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();

      const currentIndex = getCurrentIndex(event);
      const currentInput = getCurrentInput(event);

      const getClipboardData = event.clipboardData.getData('text');
      const regexText = isNotTheCharacter({
        inputRegex,
        inputType,
        value: getClipboardData,
      });

      if (regexText) return;

      const clipboardDataArray = getClipboardData
        .split('')
        .slice(0, length - currentIndex);

      const value = handleChange(event, (currentValue) => {
        // * To fill empty value with empty string
        if (!currentValue || currentValue.length < 1)
          currentValue = Array(length).fill('');

        // * For replacing value with clipboard value
        for (let i = 0; i < length; i++) {
          if (clipboardDataArray[i])
            currentValue[i + currentIndex] = clipboardDataArray[i];
        }
      });

      if (currentInput[clipboardDataArray.length + currentIndex]) {
        (
          currentInput[
            clipboardDataArray.length + currentIndex
          ] as HTMLInputElement
        ).select();
      } else {
        (
          currentInput[
            clipboardDataArray.length + currentIndex - 1
          ] as HTMLInputElement
        ).focus();
      }

      const isValueLengthMatch = value.join('').length === fieldLength;
      if (autoSubmit && isValueLengthMatch) {
        if (isFormInstance(autoSubmit as TAutoSubmit<'uncontrolled'>))
          (autoSubmit as TAutoSubmit<'uncontrolled'>).submit();
        else (autoSubmit as TAutoSubmit<'controlled'>)(value);
      }
    },
    [autoSubmit, fieldLength, handleChange, inputRegex, inputType, length],
  );
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
