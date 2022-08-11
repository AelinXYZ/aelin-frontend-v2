import { useState } from 'react'
import styled from 'styled-components'

import NftMedia from './NftMedia'
import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Metamask } from '@/src/components/assets/Metamask'
import ChangeWalletMenu from '@/src/components/common/ChangeWalletMenu'
import { Dropdown, DropdownPosition } from '@/src/components/common/Dropdown'
import { Loading } from '@/src/components/common/Loading'
import { Modal, ModalButtonCSS } from '@/src/components/common/Modal'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { RadioButton } from '@/src/components/pureStyledComponents/form/RadioButton'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useNftUserAllocation from '@/src/hooks/aelin/useNftUserAllocation'
import useUserNftsByCollections from '@/src/hooks/aelin/useUserNftsByCollections'
import { NftSelected, useNftSelection } from '@/src/providers/nftSelectionProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { shortenAddress } from '@/src/utils/string'

const Description = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  height: 41px;
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
`

const ChangeWallet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 40px;
`

const ChangeWalletLabel = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  height: 30px;
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
`

const ChangeWalletDropdown = styled(Dropdown)`
  .dropdownItems {
    background-color: ${({ theme }) => theme.headerDropdown.backgroundColor};
    border-color: ${({ theme }) => theme.headerDropdown.borderColor};
    border-radius: 6px;
    border-style: solid;
    border-width: 0.5px;
    top: calc(100% + 10px);
  }

  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: flex;
  }
`

const DropdownButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.colors.transparentWhite2};
  border: ${({ theme }) => theme.nftWhiteList.border};
  border-radius: 50px;
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;
  display: flex;
  gap: 8px;
  height: var(--header-button-height);
  padding: 3px 30px;
`

const Address = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  height: 30px;
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Card = styled(BaseCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin-top: 40px;
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderColor};
  padding: 40px 53px;
`

const Items = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 35px;
  row-gap: 25px;
  max-height: 344px;
  overflow-y: scroll;
  width: 105%;
  overflow: auto;
`

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const AllButton = styled(ButtonPrimaryLight)`
  min-width: 160px;
`

const Allocation = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin-top: 40px;
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

const SaveButton = styled(ButtonGradient)`
  ${ModalButtonCSS}
`

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 50px;
`

export type NftsPickerModalProps = {
  onClose: () => void
  pool: ParsedAelinPool
}

const OwnedNfts = genericSuspense(
  ({ onClose, pool }: NftsPickerModalProps) => {
    const [isClear, setIsClear] = useState(false)
    const { error, nfts } = useUserNftsByCollections(pool)
    const { handleStoreSelectedNfts, selectedNfts, setSelectedNfts } = useNftSelection()
    const allocation = useNftUserAllocation(pool)

    if (error) {
      throw new Error('Error getting nfts.')
    }

    const handleNftSelection = (nft: NftSelected) => {
      const nftKey = nft.contractAddress + '-' + nft.id
      if (allocation?.unlimited) {
        setSelectedNfts((prev) =>
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

    return (
      <>
        {!!nfts && Object.keys(nfts).length && (
          <Card>
            <Items>
              {Object.entries(nfts).map(
                ([nftKey, nft]: [nftKey: string, nft: NftSelected], index: number) => (
                  <Item key={index}>
                    {!!nft.imgUrl && (
                      <NftMedia
                        isDisabled={nft.blackListed}
                        onClick={() => !nft.blackListed && handleNftSelection(nft)}
                        src={nft.imgUrl}
                      />
                    )}
                    <RadioButton
                      checked={!!selectedNfts?.[nftKey]?.selected && !nft.blackListed}
                      onClick={() => !nft.blackListed && handleNftSelection(nft)}
                    />
                  </Item>
                ),
              )}
            </Items>
            <AllButton onClick={handleSelectAll}>{isClear ? 'Clear all' : 'Select all'}</AllButton>
          </Card>
        )}
        <Allocation>
          <AllocationLabel>Your allocation :</AllocationLabel>
          <AllocationValue>
            {allocation.unlimited ? 'Unlimited' : allocation.formatted} {pool.investmentTokenSymbol}
          </AllocationValue>
        </Allocation>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </>
    )
  },
  () => (
    <LoadingWrapper>
      <Loading />
      Getting owned NFTs
    </LoadingWrapper>
  ),
)

const NftsPickerModal: React.FC<NftsPickerModalProps> = ({ onClose, pool }) => {
  const { address } = useWeb3Connection()
  return (
    <Modal onClose={onClose} size="794px" title="Select NFT(s)">
      <Description>Select the NFTs you hold in your wallet to unlock deposit</Description>
      <ChangeWallet>
        <ChangeWalletLabel>Change wallet :</ChangeWalletLabel>
        <ChangeWalletDropdown
          dropdownButtonContent={
            <DropdownButton>
              <Metamask />
              {!!address && <Address>{shortenAddress(address)}</Address>}
              <ChevronDown />
            </DropdownButton>
          }
          dropdownPosition={DropdownPosition.center}
          items={[<ChangeWalletMenu key={'wallet_dopdown'} />]}
        />
      </ChangeWallet>
      <OwnedNfts onClose={onClose} pool={pool} />
    </Modal>
  )
}

export default NftsPickerModal
