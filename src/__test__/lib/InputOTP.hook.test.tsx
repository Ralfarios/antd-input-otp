import { useState } from 'react';

import { act, render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { InputOTP } from '../../lib';
import { useInputOTP } from '../../lib/InputOTP.hook';
import { InputOTPProps, UseInputOTPProps } from '../../lib/InputOTP.type';

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
  it('`autoSubmit` on uncontrolled form triggered when the value is true', async () => {
    const props: InputOTPProps = {
      autoSubmit: jest.fn(),
      length: 4,
    };
    const Component = () => {
      const [otp, setOtp] = useState<string[]>([]);

      return (
        <InputOTP value={otp} onChange={(value) => setOtp(value)} {...props} />
      );
    };

    const { container } = render(<Component />);

    const inputElements = container.querySelectorAll('input');

    await act(async () => {
      await userEvent.type(inputElements[0], '1');
      await userEvent.type(inputElements[1], '2');
      await userEvent.type(inputElements[2], '3');
      await userEvent.type(inputElements[3], '4');
    });

    expect(props.autoSubmit).toHaveBeenCalled();
  });
  it('`handleKeyDown` function should be called when `Backspace`, `ArrowLeft` or `ArrowRight` pressed', async () => {
    const props: InputOTPProps = {
      autoSubmit: jest.fn(),
      length: 6,
    };
    const Component = () => {
      const [otp, setOtp] = useState<string[]>(['1', '2', '3', '', '', '']);

      return (
        <InputOTP value={otp} onChange={(value) => setOtp(value)} {...props} />
      );
    };

    const { container } = render(<Component />);

    const inputElements = container.querySelectorAll('input');

    await act(async () => {
      await userEvent.type(inputElements[2], '{backspace}');
    });

    expect(document.activeElement).toBe(inputElements[2]);

    await act(async () => {
      await userEvent.type(inputElements[3], '{arrowleft}');
    });

    expect(document.activeElement).toBe(inputElements[3]);

    await act(async () => {
      await userEvent.type(inputElements[4], '{arrowright}');
    });

    expect(document.activeElement).toBe(inputElements[4]);
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
