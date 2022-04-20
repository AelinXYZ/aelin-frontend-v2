import React, { FC, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

interface TabsProps {
  children: React.ReactNode
  defaultIndex: number
  onSelect?: (newIndex: number) => void
}

const TabList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
`

const TabListItem = styled.li`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: 36px;
  text-align: center;

  &:first-child {
    > button {
      border: ${({ theme: { card } }) => card.borderColor};
      border-top-left-radius: ${({ theme: { card } }) => card.borderRadius};
    }
  }

  &:last-child {
    > button {
      border: ${({ theme: { card } }) => card.borderColor};
      border-top-right-radius: ${({ theme: { card } }) => card.borderRadius};
    }
  }
`

const TabLink = styled.button`
  width: 100%;
  height: 100%;
  outline: none;
  border: 0;
  padding: 0.5rem 0;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textColor};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: rgba(255, 255, 255, 0.04);

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
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.04);
  border: ${({ theme: { card } }) => card.borderColor};
  border-top: 0;
  border-bottom-right-radius: ${({ theme: { card } }) => card.borderRadius};
  border-bottom-left-radius: ${({ theme: { card } }) => card.borderRadius};
`

const Tab = styled.div<{ label?: string; disabled?: boolean }>``

const Tabs: FC<TabsProps> = ({ children, defaultIndex, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex ?? 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tabs, setTabs] = useState<any[]>(() => React.Children.toArray(children))

  useEffect(() => {
    setTabs(React.Children.toArray(children))
  }, [children])

  useEffect(() => {
    setSelectedIndex(defaultIndex)
  }, [defaultIndex])

  const onChangeTab = (nextIndex: number) => {
    if (selectedIndex === nextIndex) {
      return
    }
    setSelectedIndex(nextIndex)
    if (onSelect) {
      onSelect(nextIndex)
    }
  }

  const tabWidth = useMemo(() => {
    const fullWidth = 100
    return fullWidth / tabs.length
  }, [tabs.length])

  return (
    <Tab>
      <TabList role="tablist">
        {tabs.map((tab, index) => {
          const tabIsSelected = selectedIndex === index

          return (
            <TabListItem key={`${index}-tab`} role="presentation" style={{ width: `${tabWidth}%` }}>
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
          role: 'tabpanel',
          'aria-labelledby': `${tabs[selectedIndex].props.label}-${selectedIndex}`,
        })}
    </Tab>
  )
}

export default Tabs
export { Tab }
