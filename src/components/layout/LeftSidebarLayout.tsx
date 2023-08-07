import { ReactNode } from 'react'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import Aelin from '@/src/components/sidebar/Aelin'
import MyPools from '@/src/components/sidebar/MyPools'

const Wrapper = styled.main`
  --left-column-width: 260px;

  column-gap: 30px;
  display: grid;
  margin: 0 auto;
  max-width: 100%;
  position: relative;
  row-gap: 20px;
  width: ${({ theme }) => theme.layout.maxWidth};
  z-index: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    flex-grow: 1;
    flex-shrink: 0;
    grid-template-columns: var(--left-column-width) 1fr;
  }
`

const Main = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const SidebarWrapper = styled(BaseCard)`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  height: fit-content;
  padding: 0;
  row-gap: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    display: grid;
    column-gap: 30px;
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    display: flex;
    background-color: ${(props) => props.theme.card.backgroundColor};
    border-radius: 12px;
    border: ${(props) => props.theme.card.borderColor};
    margin-bottom: 0;
    min-height: calc(100vh - 120px);
    row-gap: 10px;
  }
`

const Break = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-color: ${({ theme }) => theme.colors.borderColor};
    display: block;
    height: 1px;
    margin: 0 20px;
  }
`

type LeftSidebarLayoutProps = {
  children: ReactNode
}

export const LeftSidebarLayout = ({ children }: LeftSidebarLayoutProps) => {
  return (
    <Wrapper>
      <SidebarWrapper as="nav">
        <MyPools />
        <Break />
        {/* <Aelin /> */}
      </SidebarWrapper>
      <Main>{children}</Main>
    </Wrapper>
  )
}
