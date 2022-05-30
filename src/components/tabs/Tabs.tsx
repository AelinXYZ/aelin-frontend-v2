import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div<{ label?: string; disabled?: boolean }>``

Wrapper.defaultProps = {
  role: 'tabpanel',
}

const TabList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`

const TabListItem = styled.li`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  margin: 0;
  min-height: 36px;
  text-align: center;

  &:first-child {
    border-top-left-radius: 8px;

    > button {
      border: ${({ theme: { card } }) => card.borderColor};
      border-top-left-radius: 8px;
    }
  }

  &:last-child {
    border-top-right-radius: 8px;

    > button {
      border: ${({ theme: { card } }) => card.borderColor};
      border-top-right-radius: 8px;
    }
  }
`

const TabLink = styled.button`
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  border: 0;
  color: ${({ theme }) => theme.colors.textColor};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 1.2rem;
  font-weight: 600;
  height: 100%;
  line-height: 1.2;
  outline: none;
  padding: 0;
  width: 100%;

  ${(props) =>
    props['aria-selected'] &&
    css`
      cursor: default;
      color: ${({ theme }) => theme.colors.textColor};
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.gradientStart} 9.37%,
        ${({ theme }) => theme.colors.gradientEnd} 100%
      );
    `};
`

export const TabContent = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: 0;
  border: ${({ theme: { card } }) => card.borderColor};
  display: flex;
  flex-direction: column;
  min-width: 320px;
  padding: 20px;
`

interface TabsProps {
  children: React.ReactNode
  defaultIndex?: number
  onSelect?: (newIndex: number) => void
}

const Tabs: FC<TabsProps> = ({ children, defaultIndex = 0, onSelect, ...restProps }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex ?? 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tabs, setTabs] = useState<any[]>(() => React.Children.toArray(children))

  useEffect(() => {
    setTabs(React.Children.toArray(children))
    setSelectedIndex(defaultIndex)
  }, [children, defaultIndex])

  const onChangeTab = (nextIndex: number) => {
    if (selectedIndex === nextIndex) {
      return
    }

    setSelectedIndex(nextIndex)

    if (onSelect) {
      onSelect(nextIndex)
    }
  }

  return (
    <Wrapper {...restProps}>
      <TabList role="tablist">
        {tabs.map((tab, index) => {
          const tabIsSelected = selectedIndex === index

          return (
            <TabListItem key={`${index}-tab`} role="presentation">
              <TabLink
                aria-controls={index + '-tab'}
                aria-selected={tabIsSelected}
                disabled={!!tab.props.disabled}
                id={`id-${index}`}
                onClick={() => onChangeTab(index)}
                role="tab"
                tabIndex={tabIsSelected ? 0 : -1}
                type="button"
              >
                {tab.props.label}
              </TabLink>
            </TabListItem>
          )
        })}
      </TabList>
      {tabs[selectedIndex] &&
        React.cloneElement(tabs[selectedIndex], {
          'aria-labelledby': `${tabs[selectedIndex].props.label}-${selectedIndex}`,
        })}
    </Wrapper>
  )
}

export default Tabs
export { Wrapper as Tab }
