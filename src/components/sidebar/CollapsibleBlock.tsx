import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ArrowDown } from '@/src/components/assets/ArrowDown'
import { ArrowUp } from '@/src/components/assets/ArrowUp'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import useLocalStorage from '@/src/hooks/localStorage/useLocalStorage'

enum CollapsibleBlockStates {
  expanded = 'expanded',
  collapsed = 'collapsed',
}

const Wrapper = styled(BaseCard)<{ state?: CollapsibleBlockStates }>`
  height: ${({ state }) => (state === CollapsibleBlockStates.expanded ? 'auto' : 'fit-content')};

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-color: transparent;
    border: none;
    margin-bottom: 0;
  }
`

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  padding: 0;
`

const Contents = styled.section`
  padding-top: 20px;
`

const Button = styled.button`
  --dimensions: 30px;

  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  height: var(--dimensions);
  justify-content: center;
  margin: 0;
  padding: 0;
  transition: 0.1s linear all;
  width: var(--dimensions);

  & svg {
    margin: 0 0 0 -2px;
  }

  &:active {
    opacity: 0.7;
  }
`

const CollapsibleBlock: React.FC<{ title: string; name: string }> = ({
  children,
  name,
  title,
  ...restProps
}) => {
  const [persistentState, setPersistentState] = useLocalStorage(
    `persistent-state_${name}`,
    CollapsibleBlockStates.expanded,
  )
  const [state, setState] = useState(
    persistentState ? persistentState : CollapsibleBlockStates.expanded,
  )
  const isCollapsed = useMemo(() => state === CollapsibleBlockStates.collapsed, [state])
  const isExpanded = useMemo(() => state === CollapsibleBlockStates.expanded, [state])

  const toggleCollapse = useCallback(() => {
    const toggledState = isCollapsed
      ? CollapsibleBlockStates.expanded
      : CollapsibleBlockStates.collapsed

    setState(toggledState)
    setPersistentState(toggledState)
  }, [isCollapsed, setPersistentState])

  return (
    <Wrapper state={state} {...restProps}>
      <Header>
        <Title>{title}</Title>
        <Button onClick={toggleCollapse}>{isExpanded ? <ArrowUp /> : <ArrowDown />}</Button>
      </Header>
      {isExpanded && <Contents>{children}</Contents>}
    </Wrapper>
  )
}

export default CollapsibleBlock
