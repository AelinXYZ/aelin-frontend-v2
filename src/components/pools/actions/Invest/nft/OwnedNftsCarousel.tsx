import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import chunk from 'lodash/chunk'
import { isMobile } from 'react-device-detect'

import NftMedia from './NftMedia'
import {
  ButtonNext,
  ButtonPrev,
  Item,
  Items,
  ItemsGroup,
  ItemsWrapper,
  LoadingWrapper,
  SectionTitle,
} from './Shared'
import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { RadioButton } from '@/src/components/pureStyledComponents/form/RadioButton'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { NFTType } from '@/src/hooks/aelin/useNftCollectionLists'
import useNftUserAllocation from '@/src/hooks/aelin/useNftUserAllocation'
import useUserNftsByCollections from '@/src/hooks/aelin/useUserNftsByCollections'
import { NftSelected, useNftSelection } from '@/src/providers/nftSelectionProvider'

const AllocationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
`
const Allocation = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 4px;
  margin-top: 10px;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.4;
`

const AllocationLabel = styled.div`
  color: ${({ theme: { colors } }) => colors.lightGray};
`

const AllocationValue = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
`

const NoNfts = styled.div`
  padding: 2rem 2rem 0 2rem;
  font-size: 1.6rem;
  font-weight: 400;
  text-align: center;
`
const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AllButton = styled(ButtonPrimaryLight)`
  min-width: 160px;
`

const Card = styled(BaseCard)<{ arrowsVisible: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderColor};

  padding: 10px 30px 30px 30px;

  width: 85%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    width: 70%;
  }

  overflow-x: hidden;

  &:hover ${ButtonPrev}, &:hover ${ButtonNext} {
    display: ${(props) => (props.arrowsVisible ? 'inline' : 'none')};
  }
`
const ButtonsWrapper = styled.div`
  gap: 20px;
  display: flex;
`

const SaveButton = styled(ButtonGradient)`
  margin: 30px auto 10px;
  min-width: 160px;
`

const CancelButton = styled(ButtonPrimaryLight)`
  margin: 30px auto 30px;
  min-width: 160px;
`

const Erc1155Eligibility = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme: { colors } }) => colors.lightGray};
`

const NFTS_PER_GROUP = 4

export type NftsPickerModalProps = {
  onClose: () => void
  pool: ParsedAelinPool
}

const OwnedNftsCarousel = genericSuspense(
  ({ onClose, pool }: NftsPickerModalProps) => {
    const [isClear, setIsClear] = useState(false)
    const { error, nfts } = useUserNftsByCollections(pool)
    const { handleStoreSelectedNfts, selectedNfts, setSelectedNfts } = useNftSelection()
    const allocation = useNftUserAllocation(pool)
    const itemsRef = useRef<HTMLInputElement>(null)

    if (error) {
      throw new Error('Error getting nfts.')
    }

    const handleNftSelection = (nft: NftSelected) => {
      const nftKey = nft.contractAddress + '-' + nft.id
      if (allocation?.unlimited) {
        setSelectedNfts(() =>
          Object.values(nfts).reduce(
            (a, b) => ({
              ...a,
              [b.contractAddress + '-' + b.id]: {
                ...b,
                selected: b.contractAddress + '-' + b.id === nftKey,
              },
            }),
            {},
          ),
        )
      } else {
        setSelectedNfts((prev) => ({
          ...prev,
          [nftKey]: {
            ...nft,
            selected: !prev[nftKey]?.selected,
          },
        }))
      }
    }

    const handleSelectAll = () => {
      if (!nfts) return
      setSelectedNfts(() => {
        return Object.values(nfts).reduce(
          (a, b) => ({
            ...a,
            [b.contractAddress + '-' + b.id]: { ...b, selected: !isClear && !b.blackListed },
          }),
          {},
        )
      })
      setIsClear((prev) => !prev)
    }

    const handleSave = () => {
      handleStoreSelectedNfts(selectedNfts)
      onClose()
    }

    const arrowsVisible = useMemo(() => {
      return !!nfts && Object.keys(nfts).length > NFTS_PER_GROUP
    }, [nfts])

    const carouselGroup = isMobile ? 1 : NFTS_PER_GROUP

    return (
      <CarouselWrapper>
        <Card arrowsVisible={arrowsVisible}>
          {!!nfts && Object.keys(nfts).length ? (
            <>
              <SectionTitle>Select NFT(s)</SectionTitle>
              <ItemsWrapper>
                <ButtonPrev
                  left="12%"
                  onClick={() => {
                    itemsRef.current?.scroll({
                      left: itemsRef.current.scrollLeft - 400,
                      behavior: 'smooth',
                    })
                  }}
                  top="25%"
                />

                <Items ref={itemsRef}>
                  {chunk(Object.entries(nfts), carouselGroup).map((itemsChunk, index, itemsArr) => {
                    return (
                      <ItemsGroup centered={itemsArr.length === 1} key={index}>
                        {itemsChunk.map(
                          ([nftKey, nft]: [nftKey: string, nft: NftSelected], index: number) => (
                            <Item key={index}>
                              {nft.type == NFTType.ERC1155 && (
                                <Erc1155Eligibility>
                                  <div>Balance: {nft.balance.toString()}</div>
                                  <div>Amount needed: {nft.erc1155AmtEligible}</div>
                                </Erc1155Eligibility>
                              )}
                              <NftMedia
                                isDisabled={nft.blackListed}
                                onClick={() => !nft.blackListed && handleNftSelection(nft)}
                                src={nft.imgUrl}
                              />
                              <RadioButton
                                checked={!!selectedNfts?.[nftKey]?.selected && !nft.blackListed}
                                onClick={() => !nft.blackListed && handleNftSelection(nft)}
                              />
                            </Item>
                          ),
                        )}
                      </ItemsGroup>
                    )
                  })}
                </Items>
                <ButtonNext
                  onClick={() => {
                    itemsRef.current?.scroll({
                      left: itemsRef.current.scrollLeft + 400,
                      behavior: 'smooth',
                    })
                  }}
                  right="12%"
                  top="25%"
                />
              </ItemsWrapper>
              <AllocationWrapper>
                <Allocation>
                  <AllocationLabel>Your allocation :</AllocationLabel>
                  <AllocationValue>
                    {allocation.unlimited ? 'Unlimited' : allocation.formatted}{' '}
                    {pool.investmentTokenSymbol}
                  </AllocationValue>
                </Allocation>
                <AllButton onClick={handleSelectAll}>
                  {isClear ? 'Clear all' : 'Select all'}
                </AllButton>
              </AllocationWrapper>
            </>
          ) : (
            <NoNfts>
              You do not own a NFT necessary to participate in the deal. Check the collection(s)
              eligible to invest and purchase one or more NFTs in order to participate in the deal.
            </NoNfts>
          )}
        </Card>
        <ButtonsWrapper>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSave}>Save</SaveButton>
        </ButtonsWrapper>
      </CarouselWrapper>
    )
  },
  () => (
    <LoadingWrapper>
      <Loading />
      Getting owned NFTs
    </LoadingWrapper>
  ),
)

export default OwnedNftsCarousel
