import { useCallback, useRef } from "react";

import type { UseInputOTPProps } from "./InputOTP.types";
import { kRegexDictionary } from "./InputOTP.constants";

export const useInputOTP = ({
  inputRegex,
  inputType,
  onChange,
}: UseInputOTPProps) => {
  const otpValue = useRef<string[]>([]);

  const getSibling = (e: React.FormEvent<HTMLInputElement>) =>
    ({
      prev: e.currentTarget.previousElementSibling,
      next: e.currentTarget.nextElementSibling,
    } as Record<"prev" | "next", (EventTarget & HTMLInputElement) | null>);

  // * This function is to keep field other than number.
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const tester =
        typeof inputRegex === "string" ? new RegExp(inputRegex) : inputRegex!;

      if (
        (inputType === "custom" && inputRegex && !tester.test(e?.key)) ||
        (inputType &&
          inputType !== "all" &&
          inputType !== "custom" &&
          kRegexDictionary[inputType].test(e?.key))
      )
        return e.preventDefault();
    },
    [inputRegex, inputType]
  );

  // * Comes from antd to make field select all value
  // * when clicked (focus).
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e?.currentTarget?.select();
  }, []);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const nextInput = getSibling(e).next;
      const currInput = e.currentTarget;
      const currInputIdx = Number(
        currInput?.id?.replace(/antd-input-otp-/, "")
      );
      const value: string = e.currentTarget?.value;

      const newOtpValue = [...otpValue.current];
      if (currInputIdx !== null && currInputIdx !== undefined) {
        newOtpValue[currInputIdx] = value;
      }
      otpValue.current = newOtpValue;
      onChange?.(otpValue.current);

      if (!nextInput || !currInput || !value) return;

      if (nextInput) nextInput.select();
      else if (!nextInput) currInput.blur();
    },
    [onChange]
  );

  // * This function is to make the field can be
  // * navigate with left / right arrow and backspace.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Backspace":
          if (e.currentTarget.value) break;
        // falls through
        case "ArrowLeft":
          e.preventDefault();
          getSibling(e).prev?.select();
          break;
        case "ArrowRight":
          e.preventDefault();
          getSibling(e).next?.select();
          break;
        default:
          break;
      }

      return;
    },
    []
  );

  return {
    handleChange,
    handleFocus,
    handleKeyDown,
    handleKeyPress,
    otpValue,
  };
};
