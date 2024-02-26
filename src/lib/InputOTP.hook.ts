import {
  useCallback,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';

import type { UseInputOTPProps } from './InputOTP.type';
import {
  getCurrentIndex,
  getCurrentInput,
  getSibling,
  isFormInstance,
  isNotTheCharacter,
} from './InputOTP.util';

// #region Handler helper
const handleAutoSubmit = (
  autoSubmit: UseInputOTPProps['autoSubmit'],
  value: string[],
) => {
  if (isFormInstance(autoSubmit)) autoSubmit.submit();
  else autoSubmit?.(value);
};

const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
  e.currentTarget.select();
};

const handleFieldChange =
  (currentIndex: number, clipboardDataArray: string[], fieldLength: number) =>
  (currentValue: string[]) => {
    // * To fill empty value with empty string
    if (!currentValue || currentValue.length < 1)
      currentValue = Array(fieldLength).fill('');

    // * For replacing value with clipboard value
    for (let i = 0; i < fieldLength; i++) {
      if (clipboardDataArray[i])
        currentValue[i + currentIndex] = clipboardDataArray[i];
    }
    return currentValue;
  };
// #endregion

export const useInputOTP = ({
  autoSubmit,
  fieldLength,
  inputRegex,
  inputType,
  isPreserveFocus,
  onChange,
  value,
}: UseInputOTPProps) => {
  const [otp, setOtp] = useState<string[]>([]);

  // #region Handle changing value
  const handleChange = useCallback(
    (
      e: FormEvent<HTMLInputElement>,
      callback?: (currentValue: string[]) => void,
    ) => {
      const currentValue = onChange ? value : otp;
      const currentIndex = getCurrentIndex(e);
      const newOtpValue = [...(currentValue ?? [])];
      newOtpValue[currentIndex] = e.currentTarget.value;

      if (!currentValue || currentValue.join('').length < 1) setOtp([]);

      callback?.(newOtpValue);
      // * When field is without controller (value and onChange props) its value need to be stored on local value
      onChange ? onChange(newOtpValue) : setOtp(newOtpValue);

      return newOtpValue;
    },
    [onChange, otp, value],
  );
  // #endregion

  // #region Handle input, auto submit and preserved focus
  const handleInput = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const { nextTarget, prevTarget } = getSibling(e);
      const currentTarget = e.currentTarget;

      const value = handleChange(e);
      const isValueLengthMatch = value.join('').length === fieldLength;

      const { inputType } = e.nativeEvent as InputEvent;
      const isInsertText = inputType === 'insertText';
      const isNotNextTarget = isInsertText && !nextTarget;

      if (isNotNextTarget && autoSubmit && isValueLengthMatch)
        handleAutoSubmit(autoSubmit, value);

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
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e?.key === 'Enter') return;
      if (isNotTheCharacter({ inputRegex, inputType, value: e?.key }))
        return e.preventDefault();
    },
    [inputRegex, inputType],
  );
  // #endregion

  // #region Handling Arrow Left and Right, also Backspace when value is empty
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    const { nextTarget, prevTarget } = getSibling(e);

    switch (e.key) {
      case 'Backspace':
        if (e.currentTarget.value) break;
      // * This block only work when the value in the field doesn't exist
      // falls through
      case 'ArrowLeft':
        e.preventDefault();
        prevTarget?.select();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextTarget?.select();
        break;
      default:
        break;
    }
  }, []);
  // #endregion

  // #region Handling Paste value
  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      const currentIndex = getCurrentIndex(e);
      const currentInput = getCurrentInput(e);

      const getClipboardData = e.clipboardData.getData('text');
      const regexText = isNotTheCharacter({
        inputRegex,
        inputType,
        value: getClipboardData,
      });

      if (regexText) return;

      const clipboardDataArray = getClipboardData
        .split('')
        .slice(0, fieldLength - currentIndex);

      const value = handleChange(
        e,
        handleFieldChange(currentIndex, clipboardDataArray, fieldLength),
      );

      const nextIndex = clipboardDataArray.length + currentIndex;
      const nextInputElement = (currentInput[nextIndex] ||
        currentInput[nextIndex - 1]) as HTMLInputElement;

      if (nextInputElement) {
        if (nextIndex === currentIndex) {
          nextInputElement.select();
        } else {
          nextInputElement.focus();
        }
      }

      const isValueLengthMatch = value.join('').length === fieldLength;
      if (autoSubmit && isValueLengthMatch) handleAutoSubmit(autoSubmit, value);
    },
    [inputRegex, inputType, fieldLength, handleChange, autoSubmit],
  );
  // #endregion

  return {
    handleFocus,
    handleInput,
    handleKeyDown,
    handleKeyPress,
    handlePaste,
    otp,
  };
};
