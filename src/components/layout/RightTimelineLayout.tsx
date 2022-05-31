import { HTMLAttributes } from 'react'
import styled from 'styled-components'

import CollapsibleBlock from '@/src/components/common/CollapsibleBlock'
import { Timeline } from '@/src/components/pools/common/Timeline'
import { TimelineSteps } from '@/types/aelinPool'

export const Wrapper = styled.main`
  --timeline-width: 296px;

  column-gap: 40px;
  display: grid;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: 100%;
  position: relative;
  row-gap: 20px;
  width: ${({ theme }) => theme.layout.maxWidth};
  z-index: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    grid-template-columns: 1fr var(--timeline-width);
    flex-grow: 1;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    column-gap: 60px;
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

export const TimelineWrapper = styled(CollapsibleBlock)`
  order: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    background-color: transparent;
    border: none;
    margin-bottom: 0;
    order: 1;
    padding: 0;

    .header {
      display: none;
    }

    .collapsableContents {
      height: auto !important;
      padding: 0;
    }

    .contentsInner {
      padding: 0;
    }
  }
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  timelineSteps?: TimelineSteps
}

export const RightTimelineLayout: React.FC<Props> = ({ children, timelineSteps, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Section>{children}</Section>
      <TimelineWrapper name="timeline" title={'Timeline'}>
        <Timeline timelineSteps={timelineSteps} />
      </TimelineWrapper>
    </Wrapper>
  )
}
