import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
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
  padding: 10px 10px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-color: transparent;
    border: none;
    margin-bottom: 0;
    padding: 20px;
  }
`

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const Title = styled.h3`
  color: ${({ theme: { card } }) => card.titleColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  padding: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 1.2rem;
  }
`

const Button = styled.button`
  --dimensions: 24px;

  align-items: center;
  background: ${({ theme: { collapsibleBlock } }) => collapsibleBlock.buttonBackgroundColor};
  border-radius: 50%;
  border: 0.5px solid ${({ theme: { collapsibleBlock } }) => collapsibleBlock.buttonBorderColor};
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

const CollapsableContents = styled.section<{ isExpanded?: boolean }>`
  height: ${({ isExpanded }) => (isExpanded ? 'auto' : '0')};
  overflow: hidden;
`

const ContentsInner = styled.section<{ isExpanded?: boolean }>`
  padding-top: 20px;
`

type CollapsibleBlockProps = {
  title: string
  name: string
  children: ReactNode
}

const CollapsibleBlock = ({ children, name, title, ...restProps }: CollapsibleBlockProps) => {
  const [isCompact, setIsCompact] = useState(false)
  const [persistentState, setPersistentState] = useLocalStorage(
    `persistent-state_${name}`,
    CollapsibleBlockStates.expanded,
  )
  const [persistentStateCompact, setPersistentStateCompact] = useLocalStorage(
    `persistent-state-compact_${name}`,
    CollapsibleBlockStates.collapsed,
  )
  const state = useMemo(
    () => (isCompact ? persistentStateCompact : persistentState),
    [isCompact, persistentState, persistentStateCompact],
  )

  const isExpanded = useMemo(() => state === CollapsibleBlockStates.expanded, [state])

  const toggleCollapse = useCallback(() => {
    const toggledState = isExpanded
      ? CollapsibleBlockStates.collapsed
      : CollapsibleBlockStates.expanded

    isCompact ? setPersistentStateCompact(toggledState) : setPersistentState(toggledState)
  }, [isExpanded, isCompact, setPersistentState, setPersistentStateCompact])

  useEffect(() => {
    const onWindowResize = () => {
      if (window.innerWidth < 1025) {
        setIsCompact(true)
      } else {
        setIsCompact(false)
      }
    }

    onWindowResize()
    window.addEventListener('resize', onWindowResize)

    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  return (
    <Wrapper state={state} {...restProps}>
      <Header className="header" onClick={toggleCollapse}>
        <Title>{title}</Title>
        <Button>{isExpanded ? <ArrowUp /> : <ArrowDown />}</Button>
      </Header>
      <CollapsableContents className="collapsableContents" isExpanded={isExpanded}>
        <ContentsInner className="contentsInner">{children}</ContentsInner>
      </CollapsableContents>
    </Wrapper>
  )
}

export default CollapsibleBlock
