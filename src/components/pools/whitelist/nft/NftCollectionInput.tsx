import { useMemo, useState } from 'react'
import styled from 'styled-components'

import debounce from 'lodash/debounce'

import NftMedia from '../../actions/Invest/NftMedia'
import { Search } from '@/src/components/assets/Search'
import { Loading } from '@/src/components/common/Loading'
import {
  NftType,
  SelectedNftCollectionData,
} from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'
import { DEBOUNCED_INPUT_TIME } from '@/src/constants/misc'
import useNftCollectionList, {
  NFTType,
  NftCollectionData,
} from '@/src/hooks/aelin/useNftCollectionList'

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
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: 1px solid ${({ theme: { nftWhiteList } }) => nftWhiteList.border};

  ${({ isOpen }) =>
    isOpen &&
    'border-bottom: none; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;'}
  width: 100%;
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

const Collections = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 216px;
  overflow-y: scroll;
  border: 1px solid ${({ theme: { textField } }) => textField.active.borderColor};
  border-top: none;
  border-bottom-left-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
  border-bottom-right-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
  width: 100%;
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
  padding: 15px 14px 15px 10px;
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

const Details = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`

type NftCollectionInputProps = {
  nftType: NftType
  selectedCollection: SelectedNftCollectionData
  onChange: (value: NftCollectionData) => void
}

const NftCollectionInput = ({ nftType, onChange, selectedCollection }: NftCollectionInputProps) => {
  const [input, setInput] = useState<string>('')
  const [query, setQuery] = useState<string>('')

  const debouncedChangeHandler = useMemo(() => debounce(setQuery, DEBOUNCED_INPUT_TIME), [setQuery])
  const NFTtypeSelected = useMemo(() => {
    if (nftType && nftType.includes('1155')) return NFTType.ERC1155
    return NFTType.ERC721
  }, [nftType])

  const { data: collections, error, isValidating } = useNftCollectionList(query, NFTtypeSelected)

  if (error) {
    throw new Error('Unexpected error when fetching nft metadata')
  }

  return (
    <Wrapper>
      <SearchWrapper>
        <Search />
      </SearchWrapper>
      <Input
        isOpen={!!input.length && !!collections && collections.length > 0}
        onChange={(e) => {
          setInput(e.target.value)
          debouncedChangeHandler(e.target.value.trim().toLowerCase())
        }}
        placeholder="Enter NFT collection name..."
        type="text"
        value={input ?? selectedCollection.nftCollectionData?.name ?? ''}
      />
      {isValidating && (
        <Collections>
          <Loading />
        </Collections>
      )}
      {!!input.length && !!collections?.length && !isValidating && (
        <Collections>
          {collections?.map((collection) => {
            return (
              <Item
                isActive={
                  !!selectedCollection.nftCollectionData &&
                  collection.id === selectedCollection.nftCollectionData.id
                }
                key={`${collection.network}-${collection.id}`}
                onMouseDown={() => {
                  onChange(collection)
                  setInput('')
                  setQuery('')
                }}
              >
                <Details>
                  {!!collection.imageUrl && (
                    <NftMedia height={24} spinner={false} src={collection.imageUrl} width={24} />
                  )}
                  <span>{collection.name}</span>
                </Details>
                {!!collection.totalSupply && (
                  <Details>
                    <span>{`${collection.totalSupply} ${
                      collection.totalSupply === 1 ? 'item' : 'items'
                    }`}</span>
                  </Details>
                )}
              </Item>
            )
          })}
        </Collections>
      )}
    </Wrapper>
  )
}

export default NftCollectionInput
