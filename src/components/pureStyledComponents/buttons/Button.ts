import styled, { css } from 'styled-components'

export const DisabledButtonCSS = css`
  cursor: not-allowed;
  opacity: 0.5;
`

export const ButtonCSS = css`
  align-items: center;
  border-radius: 25px;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
  display: flex;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 1.4rem;
  font-weight: 400;
  gap: 8px;
  height: 36px;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 0 24px;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s ease-out;
  user-select: none;
  white-space: nowrap;

  &:active {
    opacity: 0.5;
  }
`

export const ButtonPrimaryCSS = css`
  background-color: ${({ theme }) => theme.buttonPrimary.backgroundColor};
  border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
  color: ${({ theme }) => theme.buttonPrimary.color};

  &:hover {
    background-color: ${({ theme }) => theme.buttonPrimary.backgroundColorHover};
    border-color: ${({ theme }) => theme.buttonPrimary.borderColorHover};
    color: ${({ theme }) => theme.buttonPrimary.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme }) => theme.buttonPrimary.borderColor};
    border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
    color: ${({ theme }) => theme.buttonPrimary.color};
  }
`

export const ButtonGradientCSS = css`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gradientStart} 9.37%,
    ${({ theme }) => theme.colors.gradientEnd} 100%
  );
  border: none;
  color: ${({ theme }) => theme.colors.textColor};
  font-weight: 500;

  &:hover {
    /* ? */
  }

  &[disabled],
  &[disabled]:hover {
    /* ? */
  }
`

const BaseButton = styled.button`
  ${ButtonCSS}
`

export const Button = styled(BaseButton)`
  &[disabled],
  &[disabled]:hover {
    ${DisabledButtonCSS}
  }
`

export const ButtonPrimary = styled(BaseButton)`
  ${ButtonPrimaryCSS}
`

export const GradientButton = styled(BaseButton)`
  ${ButtonGradientCSS}
`

export const TabButton = styled(ButtonPrimary)<{ isActive?: boolean }>`
  background-color: transparent;
  border-color: #babcc1;
  color: #babcc1;
  font-size: 1rem;
  font-weight: 400;
  height: 24px;
  margin: 0;
  opacity: 0.7;
  padding-left: 10px;
  padding-right: 10px;

  ${({ isActive, theme }) =>
    isActive &&
    `
      background-color: ${theme.buttonPrimary.backgroundColor};
      border-color: ${theme.buttonPrimary.borderColor};
      color: ${theme.buttonPrimary.colorHover};
  `}
`
