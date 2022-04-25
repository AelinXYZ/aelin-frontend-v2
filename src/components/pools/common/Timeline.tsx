import styled from 'styled-components'

import { Deadline } from '@/src/components/common/Deadline'
import { StepCircleBig as BaseStepCircle } from '@/src/components/timeline/StepCircle'

const Wrapper = styled.div`
  --step-height: 86px;

  display: grid;
  grid-template-columns: 1fr;
  margin: 0 0 0 auto;
  position: relative;
  row-gap: 20px;
  width: 100%;

  &::before {
    background-color: rgba(255, 255, 255, 0.2);
    bottom: calc(var(--step-height) / 2);
    content: '';
    left: 16px;
    position: absolute;
    top: calc(var(--step-height) / 2);
    width: 4px;
    z-index: 10;
  }
`

const Item = styled.div`
  align-items: center;
  column-gap: 20px;
  display: grid;
  grid-template-columns: 36px 1fr;
`

const Info = styled.div<{ isActive?: boolean; isDone?: boolean }>`
  background: ${({ theme: { colors } }) => colors.componentBackgroundColor};
  border-radius: 8px;
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  opacity: ${({ isActive, isDone }) => (isActive || isDone ? 1 : 0.5)};
  padding: 20px;
`

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 4px;
`

const Value = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
`

const StepCircleBig = styled(BaseStepCircle)``

const Step: React.FC<{ isActive?: boolean; isDone?: boolean }> = ({
  children,
  isActive,
  isDone,
  ...restProps
}) => {
  return (
    <Item {...restProps}>
      <StepCircleBig />
      <Info isActive={isActive} isDone={isDone}>
        {children}
      </Info>
    </Item>
  )
}

export const Timeline: React.FC<{ activeItem?: number }> = ({ activeItem = 0, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Step isActive={activeItem === 0} isDone={activeItem > 0}>
        <Title>Pool Creation</Title>
        <Value>Jan 1, 2022, 10.00AM</Value>
      </Step>
      <Item>
        <StepCircleBig />
        <Info>
          <Title>Investment window</Title>
          <Value>Jan 1, 2022, 10.00AM</Value>
        </Info>
      </Item>
      <Item>
        <StepCircleBig />
        <Info>
          <Title>Deal creation</Title>
          <Value>Feb 1, 2022 11:00AM</Value>
        </Info>
      </Item>
      <Item>
        <StepCircleBig />
        <Info>
          <Title>Round 2 investment</Title>
          <Deadline progress="0" width="180px">
            <Value>Ended Apr 30, 2022, 11:59</Value>
          </Deadline>
        </Info>
      </Item>
      <Item>
        <StepCircleBig />
        <Info>
          <Title>Vesting cliff</Title>
          <Deadline progress="75" width="180px">
            <Value>~89d 23h 59m</Value>
          </Deadline>
          <Value>Ends Jul 31, 2022 11:59PM</Value>
        </Info>
      </Item>
    </Wrapper>
  )
}
