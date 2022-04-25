import styled from 'styled-components'

import { Deadline } from '@/src/components/common/Deadline'
import { StepCircleBig as BaseStepCircle } from '@/src/components/timeline/StepCircle'
import { PoolTimelineState } from '@/src/constants/types'

const Wrapper = styled.div`
  --gap: 20px;
  --line-gap: calc(var(--gap) + 2px); // 2px for the border

  display: grid;
  grid-template-columns: 1fr;
  margin: 0 0 0 auto;
  row-gap: var(--gap);
  width: 100%;
`

const Item = styled.div<{ isActive?: boolean; isDone?: boolean }>`
  align-items: center;
  column-gap: 20px;
  display: grid;
  grid-template-columns: 36px 1fr;
  position: relative;

  &:not(:first-child) {
    .info::before {
      background-color: ${({ isActive, isDone, theme: { colors } }) =>
        (isActive || isDone) && colors.primary};
      bottom: 50%;
      top: calc(var(--line-gap) / -2);
    }
  }

  &:not(:last-child) {
    .info::after {
      background-color: ${({ isDone, theme: { colors } }) => isDone && colors.primary};
      bottom: calc(var(--line-gap) / -2);
      top: 50%;
    }
  }
`

const StepCircleBig = styled(BaseStepCircle)`
  position: relative;
  z-index: 10;
`

const Info = styled.div<{ isActive?: boolean; isDone?: boolean }>`
  --border-radius: 8px;

  background: ${({ isActive, theme: { colors } }) =>
    isActive
      ? `linear-gradient(90deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`
      : 'none'};
  border-radius: var(--border-radius);
  border: 1px solid
    ${({ isActive, theme: { colors } }) => (isActive ? 'transparent' : colors.borderColor)};
  position: relative;
  z-index: 5;

  &::before,
  &::after {
    background-color: rgba(255, 255, 255, 0.2);
    content: '';
    left: -41px;
    position: absolute;
    width: 4px;
  }
`

const Contents = styled.div<{ isActive?: boolean; isDone?: boolean }>`
  background: ${({ theme: { colors } }) => colors.componentBackgroundColor};
  border-radius: var(--border-radius);
  height: 100%;
  opacity: ${({ isActive, isDone }) => (isActive || isDone ? 1 : 0.5)};
  padding: 20px;
  width: 100%;
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

const Step: React.FC<{ isActive?: boolean; isDone?: boolean }> = ({
  children,
  isActive,
  isDone,
  ...restProps
}) => {
  return (
    <Item isActive={isActive} isDone={isDone} {...restProps}>
      <StepCircleBig isActive={isActive || isDone} />
      <Info className="info" isActive={isActive} isDone={isDone}>
        <Contents isActive={isActive} isDone={isDone}>
          {children}
        </Contents>
      </Info>
    </Item>
  )
}

export const Timeline: React.FC<{ activeItem?: PoolTimelineState }> = ({
  activeItem = PoolTimelineState.poolCreation,
  ...restProps
}) => {
  const items = [
    {
      state: PoolTimelineState.poolCreation,
      content: (
        <>
          <Title>Pool Creation</Title>
          <Value>Jan 1, 2022, 10.00AM</Value>
        </>
      ),
    },
    {
      state: PoolTimelineState.investmentWindow,
      content: (
        <>
          <Title>Investment window</Title>
          <Value>Jan 1, 2022, 10.00AM</Value>
        </>
      ),
    },
    {
      state: PoolTimelineState.dealCreation,
      content: (
        <>
          <Title>Deal creation</Title>
          <Value>Feb 1, 2022 11:00AM</Value>
        </>
      ),
    },
    {
      state: PoolTimelineState.dealWindow,
      content: (
        <>
          <Title>Deal Window</Title>
          <Value>--</Value>
        </>
      ),
    },
    {
      state: PoolTimelineState.roundInvestment,
      content: (
        <>
          <Title>Round X investment</Title>
          <Deadline progress="0" width="180px">
            <Value>Ended Apr 30, 2022, 11:59</Value>
          </Deadline>
        </>
      ),
    },
    {
      state: PoolTimelineState.vestingPeriod,
      content: (
        <>
          <Title>Vesting period</Title>
          <Value>--</Value>
        </>
      ),
    },
    {
      state: PoolTimelineState.vestingCliff,
      content: (
        <>
          <Title>Vesting cliff</Title>
          <Deadline progress="75" width="180px">
            <Value>~89d 23h 59m</Value>
          </Deadline>
          <Value>Ends Jul 31, 2022 11:59PM</Value>
        </>
      ),
    },
  ]

  items.sort((a, b) => (a.state > b.state ? 1 : -1))

  return (
    <Wrapper {...restProps}>
      {items.map(({ content, state }, index) => (
        <Step isActive={activeItem === state} isDone={activeItem > state} key={index}>
          {content}
        </Step>
      ))}
    </Wrapper>
  )
}
