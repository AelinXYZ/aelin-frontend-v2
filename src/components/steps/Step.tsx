import { DOMAttributes } from 'react'
import styled from 'styled-components'

import { StepCircle as BaseStepCircle } from '@/src/components/steps/StepCircle'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  width: 80px;
`

const StepCircle = styled(BaseStepCircle)`
  position: relative;
  z-index: 15;
`

StepCircle.defaultProps = {
  className: 'stepCircle',
}

const Text = styled.div<{ isActive?: boolean; isDone?: boolean }>`
  color: ${({ isActive, isDone, theme: { steps } }) =>
    isActive ? steps.textIsActiveColor : isDone ? steps.textIsDoneColor : steps.textColor};
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

interface Props extends DOMAttributes<HTMLDivElement> {
  className?: string
  isActive?: boolean
  isDone?: boolean
}

export const Step: React.FC<Props> = ({ children, className, isActive, isDone, ...restProps }) => {
  return (
    <Wrapper className={`${className} step`} {...restProps}>
      <StepCircle isActive={isActive || isDone} />
      <Text isActive={isActive} isDone={isDone}>
        {children}
      </Text>
    </Wrapper>
  )
}
