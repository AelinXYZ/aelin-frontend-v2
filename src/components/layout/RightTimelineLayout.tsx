import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  --timeline-width: 200px;

  column-gap: 30px;
  display: grid;
  flex-grow: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns:
      calc(100% - var(--timeline-width) - 30px)
      var(--timeline-width);
  }
`

const Main = styled.div`
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
  timeline: React.ReactNode
}

export const RightTimelineLayout: React.FC<Props> = ({ children, timeline, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Main className="main">{children}</Main>
      <TimelineWrapper>{timeline}</TimelineWrapper>
    </Wrapper>
  )
}
