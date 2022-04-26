import { useState } from 'react'
import styled, { css } from 'styled-components'

import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled(BaseCard)`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: fit-content;
  justify-content: center;
  min-height: 236px;
  padding: 0;
`

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 30px 40px;
`

const Tabs = styled.div`
  display: flex;
  width: 100%;
`

const TitleActiveCSS = css`
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gradientStart} 9.37%,
    ${({ theme }) => theme.colors.gradientEnd} 100%
  );
  cursor: default;
  font-weight: 600;

  &:active {
    opacity: 1;
  }
`

const Tab = styled.h3<{ isActive?: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  font-size: 1.2rem;
  font-weight: 600;
  justify-content: center;
  line-height: 1.4;
  margin: 0;
  min-height: 34px;
  padding: 0 10px;
  text-align: center;
  transition: opacity 0.15s linear;

  &:active {
    opacity: 0.7;
  }

  ${({ isActive }) => isActive && TitleActiveCSS}

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

export const ActionTabs: React.FC<{
  tabs?: Array<{ value: string; key: string; children: React.ReactNode }> | undefined
}> = ({ tabs = undefined, children, ...restProps }) => {
  const tabsExist = tabs && tabs.length
  const [activeItem, setActiveItem] = useState(tabsExist ? tabs[0].key : undefined)

  const onItemClick = (key: string) => {
    setActiveItem(key)
  }

  return (
    <Wrapper {...restProps}>
      {tabsExist ? (
        <Tabs>
          {tabs.map(({ key, value }) => (
            <Tab isActive={activeItem === key} key={key} onClick={() => onItemClick(key)}>
              {value}
            </Tab>
          ))}
        </Tabs>
      ) : null}
      <Content>
        {tabsExist
          ? tabs.map(({ children, key }) => (activeItem === key ? children : null))
          : children}
      </Content>
    </Wrapper>
  )
}
