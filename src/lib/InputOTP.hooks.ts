import { useCallback, useState } from 'react';

import { kRegexDictionary } from './InputOTP.constants';
import type { UseInputOTPProps } from './InputOTP.types';

export const useInputOTP = ({
  autoSubmit,
  inputRegex,
  inputType,
  onChange,
  length,
}: UseInputOTPProps) => {
  const [otpValue, setOtpValue] = useState<string[]>([]);

  const getSibling = (e: React.FormEvent<HTMLInputElement>) =>
    ({
      prev: e.currentTarget.previousElementSibling,
      next: e.currentTarget.nextElementSibling,
    }) as Record<'prev' | 'next', (EventTarget & HTMLInputElement) | null>;

  // * This function is to keep field other than number.
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const tester =
        typeof inputRegex === 'string' ? new RegExp(inputRegex) : inputRegex!;

      // * For bypassing enter key for submit
      if (e?.key === 'Enter') return;

      if (
        (inputType === 'custom' && inputRegex && !tester.test(e?.key)) ||
        (inputType &&
          inputType !== 'all' &&
          inputType !== 'custom' &&
          kRegexDictionary[inputType].test(e?.key))
      )
        return e.preventDefault();
    },
    [inputRegex, inputType],
  );

  // * Comes from antd to make field select all value
  // * when clicked (focus).
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e?.currentTarget?.select();
  }, []);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const nextInput = getSibling(e).next;
      const prevInput = getSibling(e).prev;
      const currInput = e.currentTarget;
      const target = e?.target as HTMLElement;
      const currInputIdx = Array.from(target?.parentNode!.children).indexOf(
        target,
      );
      const value: string = e.currentTarget?.value;

      const newOtpValue = [...otpValue];

      if (currInputIdx !== null && currInputIdx !== undefined) {
        newOtpValue[currInputIdx] = value;
      }

      setOtpValue(newOtpValue);
      onChange?.(newOtpValue);

      // * To keep backspace pressed only once.
      if ((e.nativeEvent as InputEvent).inputType === 'deleteContentBackward')
        prevInput?.select();

      if (
        autoSubmit &&
        !nextInput &&
        (e.nativeEvent as InputEvent).inputType !== 'deleteContentBackward' &&
        newOtpValue.join('').length === length
      ) {
        autoSubmit.submit();
      }

      if (!nextInput || !currInput || !value) return;

      if (nextInput) nextInput.select();
      else if (!nextInput) currInput.blur();
    },
    [onChange, otpValue],
  );

  // * This function is to make the field can be
  // * navigate with left / right arrow and backspace.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Backspace':
          if (e.currentTarget.value) break;
        // falls through
        case 'ArrowLeft':
          e.preventDefault();
          getSibling(e).prev?.select();
          break;
        case 'ArrowRight':
          e.preventDefault();
          getSibling(e).next?.select();
          break;
        default:
          break;
      }

      return;
    },
    [],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault(); // * To prevent skip paste field
      const target = e?.target as HTMLElement;
      const currentInput = Array.from(target?.parentNode!.children);
      const currentInputIdx = currentInput.indexOf(target);

      const getClipboardData = e.clipboardData.getData('text');

      // #region For checking clipboard value only exist number
      const tester =
        typeof inputRegex === 'string' ? new RegExp(inputRegex) : inputRegex!;

      if (
        (inputType === 'custom' &&
          inputRegex &&
          !tester.test(getClipboardData)) ||
        (inputType &&
          inputType !== 'all' &&
          inputType !== 'custom' &&
          kRegexDictionary[inputType].test(getClipboardData))
      )
        return;
      // #endregion

      const clipboardDataArray = getClipboardData
        .split('')
        .slice(0, length - currentInputIdx);
      let currentValue = [...otpValue];

      if (!currentValue || currentValue.length < 1)
        currentValue = Array(length).fill(''); // * To fill empty value with empty string

      // #region For replacing value with clipboard value
      for (let i = 0; i < length; i++) {
        if (clipboardDataArray[i])
          currentValue[i + currentInputIdx] = clipboardDataArray[i];
      }
      // #endregion

      setOtpValue(currentValue);
      onChange?.(currentValue);

      // #region For set which field should be focused
      if (currentInput[clipboardDataArray.length + currentInputIdx]) {
        (
          currentInput[
            clipboardDataArray.length + currentInputIdx
          ] as HTMLInputElement
        ).select();
      } else {
        (
          currentInput[
            clipboardDataArray.length + currentInputIdx - 1
          ] as HTMLInputElement
        ).focus();
      }
      // #endregion
    },
    [length, onChange, otpValue],
  );

  return {
    handleChange,
    handleFocus,
    handleKeyDown,
    handleKeyPress,
    handlePaste,
    otpValue,
  };
};
