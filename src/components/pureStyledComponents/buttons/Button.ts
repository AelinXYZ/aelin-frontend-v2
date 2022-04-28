import styled, { css } from 'styled-components'

export const DisabledButtonCSS = css`
  cursor: not-allowed;
  opacity: 0.5;
`

export const ButtonCSS = css`
  align-items: center;
  border-radius: 25px;
  border-style: solid;
  border-width: 0.5px;
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
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
    color: ${({ theme }) => theme.buttonPrimary.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme }) => theme.buttonPrimary.borderColor};
    border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
    color: ${({ theme }) => theme.buttonPrimary.color};
  }
`

export const ButtonPrimaryLightCSS = css`
  background-color: ${({ theme }) => theme.buttonPrimaryLight.backgroundColor};
  border-color: ${({ theme }) => theme.buttonPrimaryLight.borderColor};
  color: ${({ theme }) => theme.buttonPrimaryLight.color};

  &:hover {
    background-color: ${({ theme }) => theme.buttonPrimaryLight.backgroundColorHover};
    border-color: ${({ theme }) => theme.buttonPrimaryLight.borderColorHover};
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
    color: ${({ theme }) => theme.buttonPrimaryLight.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme }) => theme.buttonPrimaryLight.borderColor};
    border-color: ${({ theme }) => theme.buttonPrimaryLight.borderColor};
    color: ${({ theme }) => theme.buttonPrimaryLight.color};
  }
`

export const ButtonPrimaryLightSmCSS = css`
  ${ButtonPrimaryLightCSS}

  height: 24px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 1rem;
  font-weight: 400;
`

export const ButtonPrimaryLighterCSS = css`
  background-color: ${({ theme }) => theme.buttonPrimaryLighter.backgroundColor};
  border-color: ${({ theme }) => theme.buttonPrimaryLighter.borderColor};
  color: ${({ theme }) => theme.buttonPrimaryLighter.color};

  &:hover {
    background-color: ${({ theme }) => theme.buttonPrimaryLighter.backgroundColorHover};
    border-color: ${({ theme }) => theme.buttonPrimaryLighter.borderColorHover};
    box-shadow: 0 0 10px rgba(225, 225, 225, 0.25);
    color: ${({ theme }) => theme.buttonPrimaryLighter.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme }) => theme.buttonPrimaryLighter.borderColor};
    border-color: ${({ theme }) => theme.buttonPrimaryLighter.borderColor};
    color: ${({ theme }) => theme.buttonPrimaryLighter.color};
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
    box-shadow: 0 0 10px #000;
  }
`
export const ButtonGradientSmCSS = css`
  ${ButtonGradientCSS}

  height: 24px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 1rem;
  font-weight: 400;
`

export const TabButtonCSS = css<{ isActive?: boolean }>`
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

export const ButtonDropdownIsOpenCSS = css`
  background-color: ${({ theme }) => theme.buttonDropdown.backgroundColor};
  border-bottom-color: transparent;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-left-color: ${({ theme }) => theme.textField.borderColor};
  border-right-color: ${({ theme }) => theme.textField.borderColor};
  border-top-color: ${({ theme }) => theme.textField.borderColor};
  color: ${({ theme }) => theme.buttonDropdown.color};

  &::after {
    transform: rotate(180deg);
  }
`

export const ButtonDropdownCSS = css`
  background-color: ${({ theme }) => theme.buttonDropdown.backgroundColor};
  border-bottom: none;
  border-color: ${({ theme }) => theme.textField.borderColor};
  border-radius: ${({ theme }) => theme.textField.borderRadius};
  border-style: ${({ theme }) => theme.textField.borderStyle};
  border-width: ${({ theme }) => theme.textField.borderWidth};
  color: ${({ theme }) => theme.buttonDropdown.color};
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 14px;
  position: relative;
  transition: transform 0.15s linear;
  width: 100%;

  &:active {
    opacity: 1;
  }

  &::after {
    --dimensions: 8px;

    content: '';
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00IDZMLjUzNiAwaDYuOTI4TDQgNnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=');
    background-position: 50% 50%;
    background-repeat: no-repeat;
    gap: 10px;
    height: var(--dimensions);
    width: var(--dimensions);
  }

  .isOpen & {
    ${ButtonDropdownIsOpenCSS}
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme }) => theme.buttonDropdown.borderColor};
    border-color: ${({ theme }) => theme.buttonDropdown.borderColor};
    color: ${({ theme }) => theme.buttonDropdown.color};
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

export const ButtonPrimary = styled(Button)`
  ${ButtonPrimaryCSS}
`

export const ButtonPrimaryLight = styled(Button)`
  ${ButtonPrimaryLightCSS}
`

export const ButtonPrimaryLightSm = styled(Button)`
  ${ButtonPrimaryLightSmCSS}
`

export const ButtonPrimaryLighter = styled(Button)`
  ${ButtonPrimaryLighterCSS}
`

export const GradientButton = styled(Button)`
  ${ButtonGradientCSS}
`
export const GradientButtonSm = styled(Button)`
  ${ButtonGradientSmCSS}
`

export const TabButton = styled(ButtonPrimary)<{ isActive?: boolean }>`
  ${TabButtonCSS}
`

export const ButtonDropdown = styled(Button)`
  ${ButtonDropdownCSS}
`
