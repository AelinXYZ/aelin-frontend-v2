import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  --timeline-width: 296px;

  column-gap: 60px;
  display: grid;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: 100%;
  width: ${({ theme }) => theme.layout.maxWidth};

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr var(--timeline-width);
  }
`

const Main = styled.main`
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
      <Main>{children}</Main>
      <TimelineWrapper>{timeline}</TimelineWrapper>
    </Wrapper>
  )
}
