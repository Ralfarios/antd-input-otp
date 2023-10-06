import React from 'react';

import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { InputRef } from 'antd';
import '@testing-library/jest-dom';

import { InputOTP, InputOTPProps } from '../../lib';
import { useInputOTP } from '../../lib/InputOTP.hook';

const inputOTPDataTestID = 'inputOTP';

const setup = (props?: InputOTPProps) => {
  return render(<InputOTP {...props} />);
};

describe('Test Input OTP Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
  it('The component should be rendered', () => {
    setup();
    const inputOTPElement = screen.queryByTestId(inputOTPDataTestID);
    expect(inputOTPElement).toBeInTheDocument();
  });
  it('The input should be autofocused when `autoFocus` prop is true', () => {
    const { getByTestId } = setup({ autoFocus: true });
    const input = getByTestId(inputOTPDataTestID).children[0];

    fireEvent.blur(input);

    fireEvent.change(input, { target: { value: '1' } });

    expect((input as HTMLInputElement).value).toBe('1');
  });
  it('The input should be disabled when `disabled prop is false', () => {
    const { getByTestId } = setup({ disabled: true });
    const input = getByTestId(inputOTPDataTestID).children[0];

    expect(input).toHaveAttribute('disabled');
  });
  it('The input should have focus() method on inputRef', () => {
    const mock = React.createRef<InputRef[]>();
    setup({ inputRef: mock });

    const focus = jest.spyOn(mock.current![0], 'focus');

    act(() => {
      mock.current![0].focus();
    });

    expect(focus).toBeCalled();
  });
  it("The input value should'nt be alphabet when the inputType is `numeric`", () => {
    const { getByTestId } = setup({ inputType: 'numeric' });
    const input = getByTestId(inputOTPDataTestID).children[0];

    userEvent.type(input, 'a');

    expect((input as HTMLInputElement).value).toBe('');
  });
  it('The initial input length should be 6 inputs', () => {
    const { getByTestId } = setup();
    const inputOTPLengthValue = getByTestId(inputOTPDataTestID).children.length;

    expect(inputOTPLengthValue).toEqual(6);
  });
  it('The minimal input length should be 2 if the length is inputted less than 2', () => {
    const { getByTestId } = setup({ length: 1 });
    const inputOTPLengthValue = getByTestId(inputOTPDataTestID).children.length;

    expect(inputOTPLengthValue).toEqual(2);
  });
  it('The maximal input length should be 16 if the length is inputted more than 16', () => {
    const { getByTestId } = setup({ length: 20 });
    const inputOTPLengthValue = getByTestId(inputOTPDataTestID).children.length;

    expect(inputOTPLengthValue).toEqual(16);
  });
  it("The fields' placeholder should be the same if the placeholder value only 1 character", () => {
    const { getByTestId } = setup({ placeholder: 'x' });
    const inputs = getByTestId(inputOTPDataTestID).children;

    let placeholder = '';

    Array.from(inputs).forEach((v) => {
      placeholder += (v as HTMLInputElement).placeholder;
    });

    expect(placeholder).toBe('xxxxxx');
  });
  it("The fields' placeholder should be matched with placeholder prop value", () => {
    const { getByTestId } = setup({ placeholder: 'xoxoxo' });
    const inputs = getByTestId(inputOTPDataTestID).children;

    let placeholder = '';

    Array.from(inputs).forEach((v) => {
      placeholder += (v as HTMLInputElement).placeholder;
    });

    expect(placeholder).toBe('xoxoxo');
  });
  it("The input's value should be the same as value prop is exist", () => {
    const testValue = ['1', '3', '4', '5', '6', '7'];
    const { getByTestId } = setup({ value: testValue });
    const inputs = getByTestId(inputOTPDataTestID).children;

    let value = '';

    Array.from(inputs).forEach((v, i) => {
      expect((v as HTMLInputElement).value).toBe(testValue[i]);
      value += (v as HTMLInputElement).value;
    });

    expect(value).toBe('134567');
  });
  it("The input's value should null if value prop is empty", () => {
    const { getByTestId } = setup();
    const inputs = getByTestId(inputOTPDataTestID).children;
    const { result } = renderHook(() =>
      useInputOTP({
        inputType: 'all',
        autoSubmit: null,
        isPreserveFocus: false,
        fieldLength: 6,
        inputRegex: undefined,
        onChange: jest.fn(),
        value: null,
      }),
    );

    let value: string | undefined;

    Array.from(inputs).forEach((v, i) => {
      if ((v as HTMLInputElement).value) {
        if (value === undefined) value = '';
        value += (v as HTMLInputElement).value || result.current.otp?.[i];
      }
    });

    expect(value).toBeUndefined();
  });
});
