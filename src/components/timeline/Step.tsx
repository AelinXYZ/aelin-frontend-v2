import styled from 'styled-components'

import { StepCircle as BaseStepCircle } from '@/src/components/timeline/StepCircle'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  width: 80px;
`

Wrapper.defaultProps = {
  className: 'step',
}

const StepCircle = styled(BaseStepCircle)`
  position: relative;
  z-index: 10;
`

StepCircle.defaultProps = {
  className: 'stepCircle',
}

const Text = styled.div<{ isActive?: boolean; isDone?: boolean }>`
  color: ${({ isActive, isDone, theme: { colors } }) =>
    isActive ? colors.primary : isDone ? colors.textColor : 'rgba(255, 255, 255, 0.4)'};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  padding: 6px 16px 0;
  position: relative;
  text-align: center;
  transition: color 0.25s linear;
  z-index: 10;
`

Text.defaultProps = {
  className: 'stepText',
}

export const Step: React.FC<{ isActive?: boolean; isDone?: boolean }> = ({
  children,
  isActive,
  isDone,
  ...restProps
}) => {
  return (
    <Wrapper {...restProps}>
      <StepCircle isActive={isActive || isDone} />
      <Text isActive={isActive} isDone={isDone}>
        {children}
      </Text>
    </Wrapper>
  )
}
