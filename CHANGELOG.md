# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>

## [1.0.0] 2023-08-05

Very first initial stable release. 🎉

## [1.0.1] 2023-09-05

- `inputStyle`, `wrapperClassName` and `wrapperStyle` is working now.
- Removing `className` and `style` props to prevent clash with input and wrapper className and style.

## [1.1.0] 2023-20-06

- Added `autoFocus` props for better UX.
- Added `inputRef` for you that want to goes hacky stuff.
- Paste to the component is working now!
- Some adjustment under the hood like changing from useRef to useState for storing the value.

## [1.1.1] 2023-11-09

- Fixed backspace button behaviour.
- Fixed enter button behaviour for submit.
- Added `__EXPERIMENTAL_autoSubmit` for auto submit when the field is uncontrolled.

## [2.0.2] 2023-05-10

- Enhance logic under the hood.
- Added autoSubmit props, now can be used for both controlled and uncontrolled field.
- Fix reset field for controlled field by using setState.
