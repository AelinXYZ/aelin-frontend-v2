import { useState } from 'react'
import styled from 'styled-components'

import { ChevronDown as BaseChevronDown } from '@/src/components/assets/ChevronDown'
import { Search } from '@/src/components/assets/Search'
import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme: { colors } }) => colors.textColor};
`

const Input = styled(Textfield)<{ isOpen: boolean }>`
  position: relative;
  padding-left: 42px;
  padding-right: 32px;
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: ${({ theme: { nftWhiteList } }) => nftWhiteList.border};

  ${({ isOpen }) =>
    isOpen &&
    'border-bottom: none; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;'}
`

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 20px;
  top: 0;
  height: 36px;
  pointer-events: none;
  z-index: 10;
`

const ChevronWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 14px;
  top: 0;
  height: 36px;
  pointer-events: none;
  z-index: 10;
`

const ChevronDown = styled(BaseChevronDown)<{ isOpen: boolean }>`
  ${({ isOpen }) => isOpen && 'transform: rotate(180deg);'}
`

const Items = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 180px;
  overflow-y: scroll;
  border: 1px solid ${({ theme: { textField } }) => textField.active.borderColor};
  border-top: none;
  border-bottom-left-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
  border-bottom-right-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
`

const Item = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ isActive, theme }) =>
    !isActive
      ? ({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor
      : theme.dropdown.item.backgroundColorHover};
  color: ${({ theme }) => theme.dropdown.item.color};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  padding: 8px 15px;
  cursor: pointer;
  user-select: none;

  &:last-child {
    border-bottom-left-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
    border-bottom-right-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
  }

  &:hover {
    background-color: ${({ theme }) => theme.dropdown.item.backgroundColorHover};
  }
`

export type NftIdSelectorProps = {
  ids: string[]
  selectedId: string
  onChange: (id: string) => void
}

const NftIdSelector = ({ ids, onChange, selectedId }: NftIdSelectorProps) => {
  const [input, setInput] = useState<string | undefined>(undefined)
  const filteredIds =
    input === undefined
      ? []
      : ids.filter((id) => id.toLowerCase().includes(input.trim().toLowerCase()))

  return (
    <Wrapper
      onBlur={() => {
        setInput(undefined)
      }}
      onFocus={() => {
        setInput(selectedId)
      }}
    >
      <SearchWrapper>
        <Search />
      </SearchWrapper>
      <Input
        isOpen={filteredIds.length > 0}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        placeholder="Enter/Select ERC-1155 ID"
        type="text"
        value={input ?? selectedId}
      />
      <ChevronWrapper>
        <ChevronDown isOpen={input !== undefined} />
      </ChevronWrapper>
      {filteredIds.length > 0 && (
        <Items>
          {filteredIds.map((id) => {
            return (
              <Item
                isActive={id === selectedId}
                key={id}
                onMouseDown={() => {
                  onChange(id)
                  setInput(undefined)
                }}
              >
                {id}
              </Item>
            )
          })}
        </Items>
      )}
    </Wrapper>
  )
}

export default NftIdSelector
