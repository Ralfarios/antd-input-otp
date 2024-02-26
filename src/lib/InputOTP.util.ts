import { kRegexDictionary } from './InputOTP.constant';
import type {
  TAutoSubmit,
  TGetSibling,
  TIsNotTheCharacter,
} from './InputOTP.type';

export const getSibling = ({
  currentTarget,
}: React.FormEvent<HTMLInputElement>) =>
  ({
    nextTarget: currentTarget.nextElementSibling,
    prevTarget: currentTarget.previousElementSibling,
  }) as TGetSibling;

export const getCurrentInput = (event: React.FormEvent<HTMLInputElement>) => {
  const target = event?.target as HTMLElement;

  return Array.from(target?.parentNode!.children);
};

export const getCurrentIndex = (event: React.FormEvent<HTMLInputElement>) => {
  const target = event?.target as HTMLElement;

  return getCurrentInput(event).indexOf(target);
};

export const isNotTheCharacter: TIsNotTheCharacter = ({
  inputType,
  inputRegex,
  value,
}) => {
  const tester =
    typeof inputRegex === 'string' ? new RegExp(inputRegex) : inputRegex!;

  const customInputType =
    inputType === 'custom' && inputRegex && !tester.test(value);

  const standardInputType =
    inputType !== 'all' &&
    inputType !== 'custom' &&
    kRegexDictionary[inputType].test(value);

  return Boolean(customInputType || standardInputType);
};

export const makeLength = (length: number) => {
  if (length < 2) return 2;
  if (length > 16) return 16;
  return length;
};

export const isFormInstance = (
  data?: TAutoSubmit<'uncontrolled'> | TAutoSubmit<'controlled'> | null,
): data is TAutoSubmit<'uncontrolled'> => {
  if (!data) return false;
  return 'submit' in data;
};
