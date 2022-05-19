import { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { Timeline as BaseTimeline } from '@/src/components/pools/common/Timeline'
import { TimelineSteps } from '@/types/aelinPool'

export const Wrapper = styled.main`
  --timeline-width: 296px;

  column-gap: 60px;
  display: grid;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: 100%;
  position: relative;
  row-gap: 20px;
  width: ${({ theme }) => theme.layout.maxWidth};
  z-index: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    grid-template-columns: 1fr var(--timeline-width);
  }
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  order: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    order: 0;
  }
`

export const Timeline = styled(BaseTimeline)`
  order: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    order: 1;
  }
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  timelineSteps?: TimelineSteps
}

export const RightTimelineLayout: React.FC<Props> = ({ children, timelineSteps, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Section>{children}</Section>
      <Timeline timelineSteps={timelineSteps} />
    </Wrapper>
  )
}
