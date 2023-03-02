import styled from 'styled-components'

import { Deadline } from '@/src/components/common/Deadline'
import { StepCircleBig as BaseStepCircle } from '@/src/components/steps/StepCircle'
import { PoolTimelineState, PoolTimelineStateTitles } from '@/src/constants/types'
import { TimelineSteps } from '@/types/aelinPool'

const Wrapper = styled.div`
  --gap: 20px;
  --line-gap: calc(var(--gap) + 2px); // 2px for the border

  display: grid;
  grid-template-columns: 1fr;
  margin: 0 0 0 auto;
  row-gap: var(--gap);
  width: 100%;
`

const Item = styled.div`
  align-items: center;
  column-gap: 20px;
  display: grid;
  grid-template-columns: 36px 1fr;
  position: relative;

  &:first-child {
    .info::before {
      display: none;
    }
  }

  &:last-child {
    .info::after {
      display: none;
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
    background-color: ${({ theme }) => theme.steps.lineBackgroundColor};
    content: '';
    left: -41px;
    position: absolute;
    width: 4px;
  }

  &::before {
    background-color: ${({ isActive, isDone, theme: { colors } }) =>
      (isActive || isDone) && colors.primary};
    bottom: 50%;
    top: calc(var(--line-gap) / -2);
  }

  &::after {
    background-color: ${({ isDone, theme: { colors } }) => isDone && colors.primary};
    bottom: calc(var(--line-gap) / -2);
    top: 50%;
  }

  .contents {
    opacity: ${({ isActive, isDone }) => (isActive || isDone ? 1 : 0.5)};
  }
`

const Contents = styled.div`
  background: ${({ theme: { colors } }) => colors.componentBackgroundColor};
  border-radius: var(--border-radius);
  height: 100%;
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
    <Item {...restProps}>
      <StepCircleBig isActive={isActive || isDone} />
      <Info
        className="info"
        data-cy={`timeline-step-${isActive ? 'active' : 'inactive'}-${isDone ? 'done' : 'todo'}`}
        isActive={isActive}
        isDone={isDone}
      >
        <Contents className="contents">{children}</Contents>
      </Info>
    </Item>
  )
}
export const Timeline: React.FC<{ timelineSteps?: TimelineSteps }> = ({
  timelineSteps,
  ...restProps
}) => {
  const isStepDefined = (state: PoolTimelineState) => timelineSteps?.[state]?.isDefined

  const poolTimelineTitles = Object.values(PoolTimelineStateTitles)

  const states = [
    PoolTimelineState.PoolCreation,
    PoolTimelineState.InvestmentDeadline,
    PoolTimelineState.DealCreation,
    PoolTimelineState.DealDeadline,
    PoolTimelineState.Round1,
    PoolTimelineState.Round2,
    PoolTimelineState.VestingCliff,
    PoolTimelineState.VestingPeriod,
    //UpfrontDeal
    PoolTimelineState.UpfrontDealCreation,
    PoolTimelineState.UpfrontDealRedemption,
    PoolTimelineState.UpfrontDealVestingCliff,
    PoolTimelineState.UpfrontDealVestingPeriod,
  ]

  const items = states.filter(isStepDefined).map((state: PoolTimelineState, index: number) => ({
    index,
    state,
    content: (
      <>
        <Title>{poolTimelineTitles[states.indexOf(state)]}</Title>
        {timelineSteps?.[state]?.withDeadlineBar ? (
          <>
            <Deadline progress={timelineSteps?.[state]?.deadlineProgress || '0'} width="180px">
              <Value>{timelineSteps?.[state]?.deadline}</Value>
            </Deadline>
            {!timelineSteps?.[state]?.isDone && (
              <Value>{timelineSteps?.[state]?.value ?? '--'}</Value>
            )}
          </>
        ) : (
          <Value>{timelineSteps?.[state]?.value ?? '--'}</Value>
        )}
      </>
    ),
  }))

  items.sort((a, b) => (a.index > b.index ? 1 : -1))

  return (
    <Wrapper {...restProps}>
      {items.map(({ content, state }, index) => (
        <Step
          isActive={timelineSteps?.[state]?.active}
          isDone={timelineSteps?.[state]?.isDone}
          key={index}
        >
          {content}
        </Step>
      ))}
    </Wrapper>
  )
}
