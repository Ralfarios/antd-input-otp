import { render } from '@testing-library/react';
import { FormInstance } from 'antd';

import {
  getCurrentIndex,
  getCurrentInput,
  getSibling,
  isFormInstance,
  isNotTheCharacter,
  makeLength,
} from '../../lib/InputOTP.util';

const mockFormInstance: FormInstance<unknown> = {
  getFieldError: jest.fn(),
  getFieldInstance: jest.fn(),
  getFieldsError: jest.fn(),
  getFieldsValue: jest.fn(),
  getFieldValue: jest.fn(),
  getFieldWarning: jest.fn(),
  isFieldsTouched: jest.fn(),
  isFieldsValidating: jest.fn(),
  isFieldTouched: jest.fn(),
  isFieldValidating: jest.fn(),
  resetFields: jest.fn(),
  scrollToField: jest.fn(),
  setFields: jest.fn(),
  setFieldsValue: jest.fn(),
  setFieldValue: jest.fn(),
  submit: jest.fn(),
  validateFields: jest.fn(),
};

describe('Test Input OTP Util', () => {
  it('`getSibling` should work fine', () => {
    const Component = () => {
      return (
        <div aria-label="wrapper">
          <span aria-label="a" />
          <span aria-label="b" />
          <span aria-label="c" />
        </div>
      );
    };

    const { getByLabelText } = render(<Component />);

    const event = {
      currentTarget: getByLabelText('b'),
    } as React.FormEvent<HTMLInputElement>;

    const result = getSibling(event);

    expect(result.nextTarget).toEqual(getByLabelText('c'));
    expect(result.prevTarget).toEqual(getByLabelText('a'));
  });

  it('`getCurrentInput` should work fine', () => {
    const Component = () => {
      return (
        <div aria-label="wrapper">
          <span aria-label="a" />
          <span aria-label="b" />
          <span aria-label="c" />
        </div>
      );
    };

    const { getByLabelText } = render(<Component />);

    const event = {
      target: getByLabelText('b'),
    } as unknown as React.FormEvent<HTMLInputElement>;

    const result = getCurrentInput(event);

    expect(result).toEqual([
      getByLabelText('a'),
      getByLabelText('b'),
      getByLabelText('c'),
    ]);
  });

  it('`getCurrentIndex` should work fine', () => {
    const Component = () => {
      return (
        <div aria-label="wrapper">
          <span aria-label="a" />
          <span aria-label="b" />
          <span aria-label="c" />
        </div>
      );
    };

    const { getByLabelText } = render(<Component />);

    const event = {
      target: getByLabelText('b'),
    } as unknown as React.FormEvent<HTMLInputElement>;

    const index = getCurrentIndex(event);

    expect(index).toBe(1);
  });

  it("`isNotTheCharacter` should return true when value doesn't match the regex (inputType === 'custom')", () => {
    const result = isNotTheCharacter({
      inputType: 'custom',
      inputRegex: /[0-9]/,
      value: 'abc',
    });

    expect(result).toBe(true);
  });

  it("`isNotTheCharacter` should return true when the value is not numeric (inputType === 'numeric')", () => {
    const result = isNotTheCharacter({
      inputType: 'numeric',
      inputRegex: /[0-9]/,
      value: 'abc',
    });

    expect(result).toBe(true);
  });

  it('`makeLength` should return 2 when the length is 1', () => {
    const result = makeLength(1);

    expect(result).toBe(2);
  });

  it('`makeLength` should return 4 when the length is 4', () => {
    const result = makeLength(4);

    expect(result).toBe(4);
  });

  it('`makeLength` should return 16 when the length is 20', () => {
    const result = makeLength(20);

    expect(result).toBe(16);
  });

  it('`isFormInstance` should return false when `data` is not exist', () => {
    const result = isFormInstance(undefined);

    expect(result).toBe(false);
  });

  it('`isFormInstance` should return true when `data` is exist', () => {
    const result = isFormInstance(mockFormInstance);

    expect(result).toBe(true);
  });
});
