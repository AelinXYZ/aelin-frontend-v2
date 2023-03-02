import { DOMAttributes, cloneElement, createRef, useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

export enum DropdownPosition {
  center,
  left,
  right,
}

export enum DropdownDirection {
  downwards = 'down',
  upwards = 'up',
}

const Wrapper = styled.div<{ fullWidth?: boolean; isOpen: boolean; disabled: boolean }>`
  --dropdown-border-radius: 6px;

  outline: none;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'initial')};
  position: relative;
  z-index: ${(props) => (props.isOpen ? '100' : '50')};
  ${(props) => props.fullWidth && 'width: 100%;'}

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

Wrapper.defaultProps = {
  fullWidth: false,
}

const ButtonContainer = styled.div`
  background-color: transparent;
  border: none;
  display: block;
  outline: none;
  padding: 0;
  user-select: none;
  width: 100%;
`

const PositionLeftCSS = css`
  left: 0;
`

const PositionRightCSS = css`
  right: 0;
`

const PositionCenterCSS = css`
  left: 50%;
  transform: translateX(-50%);
`

const DirectionDownwardsCSS = css`
  top: calc(100% - 1px);
`

const DirectionUpwardsCSS = css`
  bottom: calc(100%);
`

const Items = styled.div<{
  dropdownDirection?: DropdownDirection
  dropdownPosition?: DropdownPosition
  isOpen: boolean
}>`
  background-color: ${({ theme }) => theme.dropdown.background};
  border-bottom-left-radius: var(--dropdown-border-radius);
  border-bottom-right-radius: var(--dropdown-border-radius);
  border-bottom: 0.5px solid ${({ theme }) => theme.dropdown.borderColor};
  border-left: 0.5px solid ${({ theme }) => theme.dropdown.borderColor};
  border-right: 0.5px solid ${({ theme }) => theme.dropdown.borderColor};
  box-shadow: ${({ theme }) => theme.dropdown.boxShadow};
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  min-width: 150px;
  position: absolute;
  white-space: nowrap;
  width: 100%;

  ${(props) => (props.dropdownPosition === DropdownPosition.left ? PositionLeftCSS : '')}
  ${(props) => (props.dropdownPosition === DropdownPosition.right ? PositionRightCSS : '')}
  ${(props) => (props.dropdownPosition === DropdownPosition.center ? PositionCenterCSS : '')}
  ${(props) =>
    props.dropdownDirection === DropdownDirection.downwards ? DirectionDownwardsCSS : ''}
  ${(props) => (props.dropdownDirection === DropdownDirection.upwards ? DirectionUpwardsCSS : '')}
`

Items.defaultProps = {
  dropdownDirection: DropdownDirection.downwards,
  dropdownPosition: DropdownPosition.left,
  isOpen: false,
}

export interface DropdownItemProps {
  disabled?: boolean
  justifyContent?: string
}

export const DropdownItemCSS = css<DropdownItemProps>`
  --dropdown-item-height: 36px;
  --dropdown-item-padding: 10px 20px;

  align-items: center;
  background-color: ${({ theme }) => theme.dropdown.item.backgroundColor};
  border-bottom: 1px solid ${({ theme }) => theme.dropdown.item.borderColor};
  color: ${({ theme }) => theme.dropdown.item.color};
  cursor: pointer;
  display: flex;
  font-size: 0.9rem;
  font-weight: 400;
  gap: 10px;
  justify-content: ${({ justifyContent }) => justifyContent};
  line-height: 1.4;
  min-height: var(--dropdown-item-height);
  overflow: hidden;
  padding: var(--dropdown-item-padding);
  text-decoration: none;
  transition: background-color 0.15s linear;
  user-select: none;
  white-space: normal;

  &.isActive {
    background-color: ${({ theme }) => theme.dropdown.item.backgroundColorActive};
    color: ${({ theme }) => theme.dropdown.item.colorActive};
    font-weight: 300;
  }

  &:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &:last-child {
    border-bottom-left-radius: var(--dropdown-border-radius);
    border-bottom-right-radius: var(--dropdown-border-radius);
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.dropdown.item.backgroundColorHover};
  }

  &:disabled,
  &[disabled] {
    &,
    &:hover {
      background-color: ${({ theme }) => theme.dropdown.item.backgroundColor};
      cursor: not-allowed;
      font-weight: 400;
      opacity: 0.5;
      pointer-events: none;
    }
  }
`

export const DropdownItem = styled.div<DropdownItemProps>`
  ${DropdownItemCSS}
`

DropdownItem.defaultProps = {
  disabled: false,
  justifyContent: 'flex-start',
}

interface Props extends DOMAttributes<HTMLDivElement> {
  activeItemHighlight?: boolean | undefined
  className?: string
  closeOnClick?: boolean
  currentItem?: number | undefined
  disabled?: boolean
  dropdownButtonContent?: React.ReactNode | string
  dropdownDirection?: DropdownDirection | undefined
  dropdownPosition?: DropdownPosition | undefined
  fullWidth?: boolean
  items: Array<unknown>
  triggerClose?: boolean
}

export const Dropdown: React.FC<Props> = (props) => {
  const {
    activeItemHighlight = true,
    className = '',
    closeOnClick = true,
    currentItem = 0,
    disabled = false,
    dropdownButtonContent,
    dropdownDirection,
    dropdownPosition,
    fullWidth,
    items,
    triggerClose,
    ...restProps
  } = props
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const node = createRef<HTMLDivElement>()

  const onButtonClick = useCallback(
    (e) => {
      e.stopPropagation()
      if (disabled) return
      setIsOpen(!isOpen)
    },
    [disabled, isOpen],
  )

  useEffect(() => {
    // Note: you can use triggerClose to close the dropdown when clicking on a specific element
    if (triggerClose) {
      setIsOpen(false)
    }

    // Note: This code handles closing when clickin outside of the dropdown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
      if (node && node.current && node.current.contains(e.target)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [node, triggerClose])

  return (
    <Wrapper
      className={`dropdown ${isOpen ? 'isOpen' : ''} ${className}`}
      disabled={disabled}
      fullWidth={fullWidth}
      isOpen={isOpen}
      ref={node}
      {...restProps}
    >
      <ButtonContainer className="dropdownButton" onClick={onButtonClick}>
        {dropdownButtonContent}
      </ButtonContainer>
      <Items
        className="dropdownItems"
        dropdownDirection={dropdownDirection}
        dropdownPosition={dropdownPosition}
        isOpen={isOpen}
      >
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.map((item: any, index: number) => {
            const isActive = activeItemHighlight && index === currentItem
            const dropdownItem = cloneElement(item, {
              className: `dropdownItem ${isActive && 'isActive'}`,
              key: item.key ? item.key : index,
              onClick: (e) => {
                e.stopPropagation()

                if (closeOnClick) {
                  setIsOpen(false)
                }

                if (!item.props.onClick) {
                  return
                }

                item.props.onClick()
              },
            })

            return dropdownItem
          })
        }
      </Items>
    </Wrapper>
  )
}
