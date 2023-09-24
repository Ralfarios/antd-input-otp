import React from 'react';

import { fireEvent, render, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { InputOTP } from '../../lib';
import { useInputOTP } from '../../lib/InputOTP.hooks';
import { UseInputOTPProps } from '../../lib/InputOTP.types';

const setup = (props: UseInputOTPProps) => {
  return renderHook(() => useInputOTP(props));
};

describe('Test Input OTP Hooks', () => {
  it('Initial `otpValue` should be empty array', () => {
    const { result } = setup({
      inputType: 'numeric',
      inputRegex: undefined,
      onChange: jest.fn(),
      length: 6,
    });

    const { otpValue } = result.current;

    expect(otpValue).toEqual([]);
  });
  it('The `handleKeyPress` function is called when `Enter` pressed', async () => {
    const { getByTestId } = render(
      <InputOTP value={['1', '2', '3', '4', '5', '6']} />,
    );
    const inputs = getByTestId('inputOTP').children;

    const { result } = setup({
      inputType: 'numeric',
      inputRegex: undefined,
      onChange: jest.fn(),
      length: 6,
    });

    act(() => {
      fireEvent.blur(inputs[5]);
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: function (): void {
          throw new Error('Function not implemented.');
        },
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    const { otpValue } = result.current;

    expect(otpValue).toEqual(['1', '2', '3', '4', '5', '6']);

    // const s = jest.spyOn(result.current, 'handleKeyPress').mockImplementation(
    //   () =>
    //     ({
    //       key: 'Enter',
    //       preventDefault: function (): void {
    //         throw new Error('Function not implemented.');
    //       },
    //     }) as unknown as React.KeyboardEvent<HTMLInputElement>,
    // );
    // fireEvent.blur(input);
    // fireEvent.keyPress(input, { key: 'Enter' });

    // expect(s).toBeCalled();
  });
  // it('The `handleKeyDown` function is called when `Backspace` pressed', () => {
  //   const { getByTestId } = render(<InputOTP />);
  //   const input = getByTestId('inputOTP').children[0];
  //   const { result } = setup({
  //     inputType: 'numeric',
  //     inputRegex: undefined,
  //     onChange: () => {},
  //     length: 6,
  //   });

  //   act(() => {
  //     fireEvent.blur(input);
  //     fireEvent.keyDown(input, { key: 'Backspace' });
  //   });

  //   jest.spyOn(result.current, 'handleKeyDown').getMockImplementation();
  // });

  // it('The `handleKeyPress` should return undefined when `Enter` pressed', () => {
  //   const { result } = setup({
  //     inputType: 'numeric',
  //     inputRegex: undefined,
  //     onChange: jest.fn(),
  //     length: 6,
  //   });
  //   const { getByTestId } = render(<InputOTP />);
  //   const input0 = getByTestId('inputOTP').children[0];

  //   fireEvent.keyPress(input0, { key: 'Enter' });

  //   expect(result.current.handleKeyPress).toBeCalled();
  // });
});
