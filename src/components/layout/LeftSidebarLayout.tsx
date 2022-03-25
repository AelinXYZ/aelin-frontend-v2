import styled from 'styled-components'

import AelinCollaps from '@/src/components/collapsContent/AelinCollaps'
import MyPoolsCollaps from '@/src/components/collapsContent/MyPoolsCollaps'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled.div`
  --left-column-width: 290px;
  column-gap: 30px;
  display: grid;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: 100%;
  width: ${({ theme }) => theme.layout.maxWidth};

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: var(--left-column-width) 1fr;
  }
`

const SidebarWrapper = styled(BaseCard)`
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
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    border: none;
    background: none;
    padding: 0;
  }
`
const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const LeftSidebarLayout: React.FC = ({ children, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <SidebarWrapper as="nav">
        <MyPoolsCollaps />
        <AelinCollaps />
      </SidebarWrapper>
      <Main>{children}</Main>
    </Wrapper>
  )
}
