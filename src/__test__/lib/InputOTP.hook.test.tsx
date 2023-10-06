import { act, render, renderHook } from '@testing-library/react';

import { InputOTP } from '../../lib';
import { useInputOTP } from '../../lib/InputOTP.hook';
import { UseInputOTPProps } from '../../lib/InputOTP.type';

const defaultProps: UseInputOTPProps = {
  autoSubmit: null,
  fieldLength: 6,
  inputRegex: undefined,
  inputType: 'all',
  isPreserveFocus: false,
  onChange: jest.fn(),
  value: null,
};

const keyboardEvent = ({
  element,
  key,
  value,
  select = jest.fn(),
}: {
  element?: HTMLElement;
  key?: string;
  value?: string;
  select?: () => void;
}) =>
  ({
    key,
    currentTarget: {
      nextElementSibling: { select },
      previousElementSibling: { select },
      blur: jest.fn(),
      value,
    },
    nativeEvent: { inputType: 'insertText' },
    target: element,
    preventDefault: jest.fn(),
  }) as unknown as React.KeyboardEvent<HTMLInputElement>;

const setup = (props?: Partial<UseInputOTPProps>) => {
  return renderHook(() =>
    useInputOTP({
      ...defaultProps,
      ...props,
    }),
  );
};

// jest.mock('../../lib/InputOTP.hook', () => ({}));

describe('Test Input OTP Hook', () => {
  it('`handleInput` function should change the value when triggered', () => {
    let currValue: string[] = [];
    const { result } = setup({
      onChange: (value) => {
        currValue = value;
        return;
      },
    });
    const { getByTestId } = render(<InputOTP />);
    const element = getByTestId('inputOTP');
    const event = keyboardEvent({ value: '1', element });

    act(() => {
      result.current.handleInput(event);
    });

    expect(currValue).toEqual(['1']);
  });
  it('`handleKeyPress` function will return nothing when `Enter` key pressed', () => {
    const { result } = setup();
    const { getByTestId } = render(<InputOTP />);
    const element = getByTestId('inputOTP');
    const event = keyboardEvent({ key: 'Enter', element });

    act(() => {
      const keyPress = result.current.handleKeyPress(event);
      expect(keyPress).toEqual(undefined);
    });
  });
});
