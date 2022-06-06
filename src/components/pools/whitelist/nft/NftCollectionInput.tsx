import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'

import { SelectedNftCollectionData } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import useNftCollectionList, {
  NftCollectionData,
} from '@/src/components/pools/whitelist/nft/useNftCollectionList'
import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
  color: ${({ theme: { colors } }) => colors.textColor};
`

const Input = styled(Textfield)`
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: ${({ theme: { nftWhiteList } }) => nftWhiteList.border};
`

const Collections = styled.div`
  display: flex;
  flex-direction: column;
  border: ${({ theme: { nftWhiteList } }) => nftWhiteList.border};
  border-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
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

  &:first-child {
    border-top-left-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
    border-top-right-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
  }

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
  selectedCollection: SelectedNftCollectionData
  onChange: (value: NftCollectionData) => void
}

const NftCollectionInput = ({ onChange, selectedCollection }: NftCollectionInputProps) => {
  const [search, setSearch] = useState<string | undefined>(undefined)

  const { collections } = useNftCollectionList(search?.trim().toLowerCase() ?? '')

  return (
    <Wrapper
      onBlur={() => {
        setSearch(undefined)
      }}
      onFocus={() => {
        setSearch(selectedCollection.nftCollectionData?.name)
      }}
    >
      {/* TODO [AELIP-15]: Replace with collection selector. */}
      <Input
        onChange={(e) => {
          setSearch(e.target.value)
        }}
        placeholder="Enter NFT collection name..."
        type="text"
        value={search ?? selectedCollection.nftCollectionData?.name ?? ''}
      />
      {collections.length > 0 && (
        <Collections>
          {collections.map((collection) => {
            return (
              <Item
                isActive={
                  !!selectedCollection.nftCollectionData &&
                  collection.id === selectedCollection.nftCollectionData.id
                }
                key={collection.id}
                onMouseDown={() => {
                  onChange(collection)
                  setSearch(undefined)
                }}
              >
                <Details>
                  <Image alt="" height={24} src={collection.imageUrl} width={24} />
                  <span>{collection.name}</span>
                </Details>
                <Details>
                  <Image alt="" height={15} src={collection.currencyImageUrl} width={8} />
                  <span>{`${collection.itemsCount} ${
                    collection.itemsCount === 1 ? 'item' : 'items'
                  }`}</span>
                </Details>
              </Item>
            )
          })}
        </Collections>
      )}
    </Wrapper>
  )
}

export default NftCollectionInput
