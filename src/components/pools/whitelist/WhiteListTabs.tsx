import styled, { css } from 'styled-components'

import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled(BaseCard)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    width: auto;
  }
  width: 315px;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: fit-content;
  justify-content: center;
  min-height: 236px;
  padding: 0;
  margin-bottom: 40px;
`

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 40px;
  width: 100%;
  background: ${({ theme }) => theme.colors.transparentWhite2};
`

const Tabs = styled.div`
  display: flex;
  width: 100%;
`

const ActiveTabCSS = css`
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gradientStart} 9.37%,
    ${({ theme }) => theme.colors.gradientEnd} 100%
  );
  border-bottom-color: transparent;
  cursor: default;
  font-weight: 600;

  &:active {
    opacity: 1;
  }
`

const Tab = styled.h3<{ isActive?: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  font-size: 1.6rem;
  font-weight: 600;
  justify-content: center;
  line-height: 1.4;
  margin: 0;
  min-height: 50px;
  padding: 0 10px;
  text-align: center;
  transition: opacity 0.15s linear;

  &:active {
    opacity: 0.7;
  }

  ${({ isActive }) => isActive && ActiveTabCSS}

  &:first-child {
    border-top-left-radius: ${({ theme: { card } }) => card.borderRadius};
  }

  &:last-child {
    border-top-right-radius: ${({ theme: { card } }) => card.borderRadius};
  }
`

Tab.defaultProps = {
  isActive: true,
}

export enum WhiteListTab {
  Addresses = 'Addresses whitelist',
  Nft = 'NFT whitelist',
}

export const WhiteListTabs: React.FC<{
  active?: WhiteListTab
  onTabClick: (tab: WhiteListTab) => void
  tabs?: WhiteListTab[]
}> = ({ active, children, onTabClick, tabs, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {tabs && tabs.length > 1 && (
        <Tabs>
          {tabs.map((action, index) => (
            <Tab
              isActive={active === action}
              key={`${action}_${index}`}
              onClick={() => onTabClick(action)}
            >
              {action}
            </Tab>
          ))}
        </Tabs>
      )}
      <Content>{children}</Content>
    </Wrapper>
  )
}
