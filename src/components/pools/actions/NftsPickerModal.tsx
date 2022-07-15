import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Metamask } from '@/src/components/assets/Metamask'
import ChangeWalletMenu from '@/src/components/common/ChangeWalletMenu'
import { Dropdown, DropdownPosition } from '@/src/components/common/Dropdown'
import { Modal, ModalButtonCSS } from '@/src/components/common/Modal'
import { NftWhitelistProcess } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { RadioButton } from '@/src/components/pureStyledComponents/form/RadioButton'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import useWhitelistedUserNfts, { WhitelistRule } from '@/src/hooks/contracts/useWhitelistedUserNfts'
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
  gap: 40px;
  max-height: 344px;
  overflow-y: scroll;
`

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const NftImage = styled(Image)<{ isDisabled?: boolean }>`
  border-radius: 8px;

  ${({ isDisabled }) => isDisabled && 'opacity: 0.2;'}
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

type Nft = {
  collectionAddress: string
  id: number
  imageUrl: string
  isBlacklisted: boolean
  isSelected: boolean
}

export type NftsPickerModalProps = {
  nftWhitelistProcess: NftWhitelistProcess
  whitelistRules: Record<string, WhitelistRule>
  blacklistedNfts: Record<string, Set<number>>
  allocationCurrency: string
  onClose: () => void
  onSave: (selectedNfts: Record<string, Set<number>>) => void
}

const NftsPickerModal = ({
  allocationCurrency,
  blacklistedNfts,
  nftWhitelistProcess,
  onClose,
  onSave,
  whitelistRules,
}: NftsPickerModalProps) => {
  const [nfts, setNfts] = useState<Nft[]>([])
  const [isClear, setIsClear] = useState(false)

  const { address = '' } = useWeb3Connection()

  const {
    data: whitelistedUserNfts,
    fetchWhitelistedUserNfts,
    isError,
    isLoading,
  } = useWhitelistedUserNfts(whitelistRules)

  useEffect(() => {
    fetchWhitelistedUserNfts()
  }, [fetchWhitelistedUserNfts])

  useEffect(() => {
    const result: Nft[] = []

    for (const collectionAddress in whitelistedUserNfts) {
      whitelistedUserNfts[collectionAddress].forEach((nft) =>
        result.push({
          collectionAddress: collectionAddress,
          id: nft.id,
          imageUrl: nft.imageUrl,
          isBlacklisted: blacklistedNfts[collectionAddress]?.has(nft.id),
          isSelected: false,
        }),
      )
    }

    setNfts(result)
  }, [whitelistedUserNfts, blacklistedNfts])

  useEffect(() => {
    if (
      nfts.reduce((acc, nft) => acc && (nft.isBlacklisted ? true : nft.isSelected), true) === true
    ) {
      setIsClear(true)
      return
    }

    if (
      nfts.reduce((acc, nft) => acc && (nft.isBlacklisted ? true : !nft.isSelected), true) === true
    ) {
      setIsClear(false)
    }
  }, [nfts])

  const getStatusInfo = () => {
    if (isLoading) {
      return <Description>Loading...</Description>
    }

    if (isError) {
      return <Error textAlign="center">Something went wrong</Error>
    }

    if (nfts.length === 0) {
      return <Error textAlign="center">You don't have whitelisted NFTs to unlock deposit</Error>
    }

    return null
  }

  const allocation = useMemo(() => {
    let allocation = 0

    switch (nftWhitelistProcess) {
      case NftWhitelistProcess.limitedPerWallet:
        for (const collectionId in whitelistRules) {
          if (nfts.findIndex((nft) => nft.collectionId === collectionId && nft.isSelected) !== -1) {
            allocation += Number(whitelistRules[collectionId].amountPerWallet)
          }
        }

        break
      case NftWhitelistProcess.limitedPerNft:
        for (const collectionAddress in whitelistRules) {
          for (const nft of nfts) {
            if (nft.collectionId === collectionId && nft.isSelected) {
              allocation += Number(whitelistRules[collectionId].amountPerNft)
            }
          }
        }

        break
      case NftWhitelistProcess.unlimited:
      case NftWhitelistProcess.minimumAmount:
        break
    }

    return allocation
  }, [nftWhitelistProcess, whitelistRules, nfts])

  return (
    <Modal onClose={onClose} size="794px" title="Select NFT(s)">
      <Description>Select the NFTs you hold in your wallet to unlock deposit</Description>
      <ChangeWallet>
        <ChangeWalletLabel>Change wallet :</ChangeWalletLabel>
        <ChangeWalletDropdown
          dropdownButtonContent={
            <DropdownButton>
              <Metamask />
              {address && <Address>{shortenAddress(address)}</Address>}
              <ChevronDown />
            </DropdownButton>
          }
          dropdownPosition={DropdownPosition.center}
          items={[<ChangeWalletMenu key={'wallet_dopdown'} />]}
        />
      </ChangeWallet>
      {nfts.length > 0 && (
        <Card>
          <Items>
            {nfts.map((nft, index) => (
              <Item key={`${nft.collectionAddress}-${nft.id}`}>
                <NftImage
                  alt=""
                  height={128}
                  isDisabled={nft.isBlacklisted}
                  src={nft.imageUrl}
                  width={128}
                />
                {!nft.isBlacklisted && (
                  <RadioButton
                    checked={nft.isSelected}
                    onClick={() => {
                      setNfts((prevNfts) => {
                        const newNfts = [...prevNfts]

                        newNfts[index] = {
                          ...newNfts[index],
                          isSelected: !newNfts[index].isSelected,
                        }

                        return newNfts
                      })
                    }}
                  />
                )}
              </Item>
            ))}
          </Items>
          <AllButton
            onClick={() => {
              setNfts((prevNfts) => {
                const newNfts = [...prevNfts]

                newNfts.forEach(
                  (nft) => (nft.isSelected = nft.isBlacklisted ? nft.isSelected : !isClear),
                )

                return newNfts
              })
            }}
          >
            {isClear ? 'Clear all' : 'Select all'}
          </AllButton>
        </Card>
      )}
      {getStatusInfo()}
      {allocation > 0 && (
        <Allocation>
          <AllocationLabel>Your allocation :</AllocationLabel>
          <AllocationValue>{`${allocation} ${allocationCurrency}`}</AllocationValue>
        </Allocation>
      )}
      <SaveButton
        onClick={() => {
          const selectedNfts: Record<string, Set<number>> = {}

          for (const nft of nfts) {
            if (!nft.isSelected) {
              continue
            }

            if (Object.prototype.hasOwnProperty.call(selectedNfts, nft.collectionAddress)) {
              selectedNfts[nft.collectionAddress].add(nft.id)
            } else {
              selectedNfts[nft.collectionAddress] = new Set([nft.id])
            }
          }

          onSave(selectedNfts)
        }}
      >
        Save
      </SaveButton>
    </Modal>
  )
}

export default NftsPickerModal
