import { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { Timeline } from '@/src/components/pools/common/Timeline'
import { TimelineSteps } from '@/types/aelinPool'

const Wrapper = styled.main`
  --timeline-width: 296px;

  column-gap: 60px;
  display: grid;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: 100%;
  row-gap: 20px;
  width: ${({ theme }) => theme.layout.maxWidth};

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr var(--timeline-width);
  }
`

const Main = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: ${({ theme }) => theme.layout.columnGap};
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    display: flex;
  }
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  timelineSteps?: TimelineSteps
}

export const RightTimelineLayout: React.FC<Props> = ({ children, timelineSteps, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Main>{children}</Main>
      <TimelineWrapper>
        <Timeline timelineSteps={timelineSteps} />
      </TimelineWrapper>
    </Wrapper>
  )
}
