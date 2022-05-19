import styled from 'styled-components'

import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import Aelin from '@/src/components/sidebar/Aelin'
import MyPools from '@/src/components/sidebar/MyPools'

const Wrapper = styled.main`
  --left-column-width: 260px;

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
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin-bottom: 20px;
  min-height: calc(100vh - 120px);
  padding: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-color: ${(props) => props.theme.card.backgroundColor};
    border-radius: 12px;
    border: ${(props) => props.theme.card.borderColor};
    margin-bottom: 0;
  }
`

const Main = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const Break = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-color: ${({ theme }) => theme.colors.borderColor};
    display: block;
    height: 1px;
    margin-bottom: 5px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
  }
`

export const LeftSidebarLayout: React.FC = ({ children, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <SidebarWrapper as="nav">
        <MyPools />
        <Break />
        <Aelin />
      </SidebarWrapper>
      <Main>{children}</Main>
    </Wrapper>
  )
}
