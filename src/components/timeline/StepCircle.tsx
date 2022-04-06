import styled, { css } from 'styled-components'

interface Props {
  isActive?: boolean
}

const StepCSS = css<Props>`
  --transition: background-color linear 0.25s;

  background-color: ${({ isActive, theme: { stepCircle } }) =>
    isActive ? stepCircle.backgroundColorActive : stepCircle.backgroundColor};
  border-radius: 50%;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--dimensions);
  position: relative;
  transition: var(--transition);
  width: var(--dimensions);

  &::before,
  &::after {
    border-radius: 50%;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
    content: '';
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    transition: var(--transition);
  }

  &::before {
    background-color: ${({ isActive, theme: { stepCircle } }) =>
      isActive ? stepCircle.backgroundColorMiddleActive : stepCircle.backgroundColorMiddle};
    height: var(--dimensions-middle);
    width: var(--dimensions-middle);
    z-index: 5;
  }

  &::after {
    background-color: ${({ isActive, theme: { stepCircle } }) =>
      isActive ? stepCircle.backgroundColorMainActive : stepCircle.backgroundColorMain};
    height: var(--dimensions-main);
    width: var(--dimensions-main);
    z-index: 10;
  }
`

export const StepCircle = styled.div<Props>`
  --dimensions: 24px;
  --dimensions-middle: 16px;
  --dimensions-main: 8px;

  ${StepCSS}
`

export const StepCircleBig = styled.div<Props>`
  --dimensions: 36px;
  --dimensions-middle: 24px;
  --dimensions-main: 12px;

  ${StepCSS}
`
