import styled from 'styled-components'

const Wrapper = styled.div`
  --left-column-width: 200px;

  column-gap: 30px;
  display: grid;
  flex-grow: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns:
      var(--left-column-width)
      calc(100% - var(--left-column-width) - 30px);
  }
`

const Main = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const SidebarWrapper = styled.div`
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

export const LeftSidebarLayout: React.FC = ({ children, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <SidebarWrapper>sidebar contents</SidebarWrapper>
      <Main className="main">{children}</Main>
    </Wrapper>
  )
}
