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
    box-shadow: ${({ theme: { textField } }) => textField.active.boxShadow};
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
    font-size: var(--texfield-font-size);
    font-style: normal;
    font-weight: var(--textfield-font-weight);
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
  --textfield-border-radius: 8px;
  --texfield-font-size: 1.4rem;
  --textfield-padding: 0 15px;
  --textfield-height: 36px;
  --textfield-font-weight: 400;

  background-color: ${({ theme: { textField } }) => textField.backgroundColor};
  border-color: ${({ status, theme: { textField } }) =>
    status === TextfieldState.error
      ? textField.errorColor
      : status === TextfieldState.success
      ? textField.successColor
      : textField.borderColor};
  border-radius: var(--textfield-border-radius);
  border-style: solid;
  border-width: 0.5px;
  color: ${({ status, theme: { textField } }) =>
    status === TextfieldState.error ? textField.errorColor : textField.color};
  font-size: var(--texfield-font-size);
  font-weight: var(--textfield-font-weight);
  height: var(--textfield-height);
  outline: none;
  overflow: hidden;
  padding: var(--textfield-padding);
  text-overflow: ellipsis;
  transition: border-color 0.15s linear;
  white-space: nowrap;
  width: 100%;

  ${TexfieldPartsCSS}
`

export const Textfield = styled.input<TextfieldProps>`
  ${TextfieldCSS}
`
