import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import groupBy from 'lodash/groupBy'

import { ParsedOwnedNft } from '../services/nft'

export type NftSelected = ParsedOwnedNft & { selected?: boolean; balance: BigNumber }

export type SelectedNfts = Record<string, NftSelected>

export interface NftPurchaseList {
  collectionAddress: string
  tokenIds: number[]
}

export type NftSelectionContextType = {
  selectedNfts: SelectedNfts
  storedSelectedNfts: NftPurchaseList[]
  setSelectedNfts: Dispatch<SetStateAction<SelectedNfts>>
  handleStoreSelectedNfts: (selectedNfts: SelectedNfts) => void
  hasStoredSelectedNft: boolean
  handleOpenNftSelectionModal: () => void
  handleCloseNftSelectionModal: () => void
  showNftSelectionModal: boolean
}
// eslint-disable-next-line
const NftSelectionContext = createContext<NftSelectionContextType>({} as any)

const NftSelectionContextProvider: React.FC = ({ children }) => {
  const [selectedNfts, setSelectedNfts] = useState<SelectedNfts>({})
  const [storedSelectedNfts, setStoredSelectedNfts] = useState<NftPurchaseList[]>([])
  const [showNftSelectionModal, setShowNftSelectionModal] = useState<boolean>(false)

  const handleOpenNftSelectionModal = () => setShowNftSelectionModal(true)
  const handleCloseNftSelectionModal = () => setShowNftSelectionModal(false)
  const handleStoreSelectedNfts = (selectedNfts: SelectedNfts) => {
    const groupedNfts = groupBy(selectedNfts, 'contractAddress')
    const nftPurchaseList = Object.entries(groupedNfts).map(([collectionAddress, nftList]) => ({
      collectionAddress,
      tokenIds: nftList.map((nft) => Number(nft.id)),
    }))
    setStoredSelectedNfts([...nftPurchaseList])
  }

  const hasStoredSelectedNft = useMemo(() => {
    if (!storedSelectedNfts?.length) {
      return false
    }
    return true
  }, [storedSelectedNfts?.length])

  return (
    <NftSelectionContext.Provider
      value={{
        selectedNfts,
        setSelectedNfts,
        hasStoredSelectedNft,
        storedSelectedNfts,
        handleStoreSelectedNfts,
        handleOpenNftSelectionModal,
        handleCloseNftSelectionModal,
        showNftSelectionModal,
      }}
    >
      {children}
    </NftSelectionContext.Provider>
  )
}

export default NftSelectionContextProvider

export function useNftSelection(): NftSelectionContextType {
  return useContext<NftSelectionContextType>(NftSelectionContext)
}
