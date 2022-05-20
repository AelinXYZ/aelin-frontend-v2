import { InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export enum TextfieldState {
  error = 'error',
  success = 'success',
}

interface TexfieldCSSProps {
  status?: TextfieldState | undefined
}

export interface TextfieldProps extends InputHTMLAttributes<HTMLInputElement>, TexfieldCSSProps {}

export const TexfieldPartsCSS = css<TexfieldCSSProps>`
  &:active,
  &:focus {
    background-color: ${({ theme: { textField } }) => textField.active.backgroundColor};
    border-color: ${({ status, theme: { textField } }) =>
      status === TextfieldState.error
        ? textField.errorColor
        : status === TextfieldState.success
        ? textField.successColor
        : textField.active.borderColor};
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    color: ${({ status, theme: { textField } }) =>
      status === TextfieldState.error ? textField.errorColor : textField.color};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme: { textField } }) => textField.backgroundColor};
    border-color: ${({ theme: { textField } }) => textField.borderColor};
    color: ${({ theme: { textField } }) => textField.active.color};
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[disabled]::placeholder,
  &[disabled]:hover::placeholder {
    color: ${({ theme: { textField } }) => textField.color}!important;
  }

  &::placeholder {
    color: ${({ theme: { textField } }) => textField.placeholder.color};
    font-size: ${({ theme: { textField } }) => textField.placeholder.fontSize};
    font-style: normal;
    font-weight: 400;
    opacity: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &[readonly] {
    background-color: ${({ theme: { textField } }) => textField.backgroundColor};
    border-color: ${({ theme: { textField } }) => textField.borderColor};
    color: ${({ theme: { textField } }) => textField.placeholder.color};
    cursor: default;
    font-style: normal;
  }

  &[type='number'] {
    -moz-appearance: textfield;
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &::-webkit-search-decoration {
    -webkit-appearance: none;
  }
`

export const TextfieldCSS = css<TexfieldCSSProps>`
  background-color: ${({ theme: { textField } }) => textField.backgroundColor};
  border-color: ${({ status, theme: { textField } }) =>
    status === TextfieldState.error
      ? textField.errorColor
      : status === TextfieldState.success
      ? textField.successColor
      : textField.borderColor};
  border-radius: ${({ theme: { textField } }) => textField.borderRadius};
  border-style: ${({ theme: { textField } }) => textField.borderStyle};
  border-width: ${({ theme: { textField } }) => textField.borderWidth};
  color: ${({ status, theme: { textField } }) =>
    status === TextfieldState.error ? textField.errorColor : textField.color};
  font-size: ${({ theme: { textField } }) => textField.fontSize};
  font-weight: ${({ theme: { textField } }) => textField.fontWeight};
  height: ${({ theme: { textField } }) => textField.height};
  outline: none;
  overflow: hidden;
  padding: 0 ${({ theme: { textField } }) => textField.paddingHorizontal};
  text-overflow: ellipsis;
  transition: border-color 0.15s linear;
  white-space: nowrap;
  width: 100%;

  ${TexfieldPartsCSS}
`

export const Textfield = styled.input<TextfieldProps>`
  ${TextfieldCSS}
`
