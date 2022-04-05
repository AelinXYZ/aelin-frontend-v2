import styled from 'styled-components'

import { Step as BaseStep } from '@/src/components/timeline/Step'

const Wrapper = styled.div`
  --step-width: 98px;

  display: flex;
  margin: 0 auto 40px;
  position: relative;
  width: fit-content;

  &::before {
    content: '';
    background-color: rgba(255, 255, 255, 0.2);
    height: 2px;
    left: calc(var(--step-width) / 2);
    position: absolute;
    right: calc(var(--step-width) / 2);
    top: 11px;
    z-index: 10;
  }
`

const Step = styled(BaseStep)<{ isDone?: boolean }>`
  position: relative;
  width: var(--step-width);
  z-index: 5;

  &:not(:last-child)::after {
    background-color: ${({ isDone, theme: { colors } }) =>
      isDone ? colors.primary : 'transparent'};
    content: '';
    height: 2px;
    left: calc(var(--step-width) / 2);
    position: absolute;
    top: 11px;
    transition: background-color 0.15s linear;
    width: calc(var(--step-width));
    z-index: 5;
  }
`

const Timeline = styled.div``

interface Props {
  data: { title: string; isActive: boolean }[]
  currentStepOrder?: number
}

export const StepIndicator: React.FC<Props> = ({ currentStepOrder = 0, data, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {data.map(({ isActive, title }, index) => (
        <Step isActive={isActive} isDone={index + 1 < currentStepOrder} key={index}>
          {title}
        </Step>
      ))}
    </Wrapper>
  )
}
