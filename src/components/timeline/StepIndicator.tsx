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

const Step = styled(BaseStep)`
  position: relative;
  width: var(--step-width);
  z-index: 5;
`

const Timeline = styled.div``

interface Props {
  data: { title: string; isActive: boolean }[]
}

export const StepIndicator: React.FC<Props> = ({ data, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {data.map(({ isActive, title }, index) => (
        <Step isActive={isActive} key={index}>
          {title}
        </Step>
      ))}
    </Wrapper>
  )
}
