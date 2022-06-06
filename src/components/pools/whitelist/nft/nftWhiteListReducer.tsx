import { NftCollectionData } from '@/src/components/pools/whitelist/nft/useNftCollectionList'

export enum NftWhiteListStep {
  nftType = 'nftType',
  whiteListProcess = 'whiteListProcess',
  nftCollection = 'nftCollection',
}

export enum NftType {
  erc721 = 'ERC-721*',
  erc1155 = 'ERC-1155',
}

export enum NftWhitelistProcess {
  unlimited = 'Unlimited',
  limitedPerWallet = 'Limited per Wallet',
  limitedPerNft = 'Limited per NFT',
  minimumAmount = 'Minimum amount',
}

export type SelectedNftData = {
  id: string
  minimumAmount: number
}

export type SelectedNftCollectionData = {
  nftCollectionData: NftCollectionData | undefined
  amountPerWallet: number
  amountPerNft: number
  selectedNftsData: SelectedNftData[]
}

export type NftWhiteListState = {
  currentStep: NftWhiteListStep
  nftType: NftType
  whiteListProcess: NftWhitelistProcess
  selectedCollections: SelectedNftCollectionData[]
}

const getInitialNftWhitelistProcess = (
  nftType: NftType,
): NftWhitelistProcess.unlimited | NftWhitelistProcess.minimumAmount => {
  switch (nftType) {
    case NftType.erc721:
      return NftWhitelistProcess.unlimited
    case NftType.erc1155:
      return NftWhitelistProcess.minimumAmount
  }
}

const getInitialSelectedCollection = (nftType: NftType): SelectedNftCollectionData => {
  let selectedNftsData: SelectedNftData[]
  switch (nftType) {
    case NftType.erc721:
      selectedNftsData = []
      break
    case NftType.erc1155:
      selectedNftsData = [{ id: '', minimumAmount: 0 }]
      break
  }

  return {
    nftCollectionData: undefined,
    amountPerNft: 0,
    amountPerWallet: 0,
    selectedNftsData: selectedNftsData,
  }
}

export const initialState: NftWhiteListState = {
  currentStep: NftWhiteListStep.nftType,
  nftType: NftType.erc721,
  whiteListProcess: getInitialNftWhitelistProcess(NftType.erc721),
  selectedCollections: [getInitialSelectedCollection(NftType.erc721)],
}

export type NftWhiteListAction =
  | {
      type: 'updateStep'
      payload: NftWhiteListStep
    }
  | {
      type: 'updateNftType'
      payload: NftType
    }
  | {
      type: 'updateWhiteListProcess'
      payload: NftWhitelistProcess
    }
  | {
      type: 'addEmptyCollection'
      payload: undefined
    }
  | {
      type: 'updateCollection'
      payload: { index: number; newCollection: NftCollectionData }
    }
  | {
      type: 'removeCollection'
      payload: number
    }
  | {
      type: 'updateAmountPerWallet'
      payload: { index: number; amount: number }
    }
  | {
      type: 'updateAmountPerNft'
      payload: { index: number; amount: number }
    }
  | {
      type: 'addEmptyNft'
      payload: number
    }
  | {
      type: 'updateNftId'
      payload: { collectionIndex: number; nftIndex: number; id: string }
    }
  | {
      type: 'updateNftMinimumAmount'
      payload: { collectionIndex: number; nftIndex: number; amount: number }
    }
  | {
      type: 'deleteNft'
      payload: { collectionIndex: number; nftIndex: number }
    }

export const nftWhiteListReducer = (state: NftWhiteListState, action: NftWhiteListAction) => {
  const { payload, type } = action

  if (type === 'updateStep') {
    return { ...state, currentStep: payload }
  }
  if (type === 'updateNftType') {
    return {
      ...state,
      nftType: payload,
      whiteListProcess: getInitialNftWhitelistProcess(payload),
      selectedCollections: [getInitialSelectedCollection(payload)],
    }
  }
  if (type === 'updateWhiteListProcess') {
    return {
      ...state,
      whiteListProcess: payload,
      selectedCollections: [getInitialSelectedCollection(state.nftType)],
    }
  }
  if (type === 'addEmptyCollection') {
    return {
      ...state,
      selectedCollections: [
        ...state.selectedCollections,
        getInitialSelectedCollection(state.nftType),
      ],
    }
  }
  if (type === 'updateCollection') {
    const newSelectedCollections = [...state.selectedCollections]
    newSelectedCollections[payload.index].nftCollectionData = payload.newCollection
    return { ...state, selectedCollections: newSelectedCollections }
  }
  if (type === 'removeCollection') {
    const newSelectedCollections = [...state.selectedCollections]
    newSelectedCollections.splice(payload, 1)
    return { ...state, selectedCollections: newSelectedCollections }
  }
  if (type === 'updateAmountPerWallet') {
    const newSelectedCollections = [...state.selectedCollections]
    newSelectedCollections[payload.index] = {
      ...newSelectedCollections[payload.index],
      amountPerWallet: payload.amount,
    }
    return { ...state, selectedCollections: newSelectedCollections }
  }
  if (type === 'updateAmountPerNft') {
    const newSelectedCollections = [...state.selectedCollections]
    newSelectedCollections[payload.index] = {
      ...newSelectedCollections[payload.index],
      amountPerNft: payload.amount,
    }
    return { ...state, selectedCollections: newSelectedCollections }
  }
  if (type === 'addEmptyNft') {
    const newSelectedCollections = [...state.selectedCollections]
    const newSelectedNftsData = [
      ...state.selectedCollections[payload].selectedNftsData,
      { id: '', minimumAmount: 0 },
    ]
    newSelectedCollections[payload] = {
      ...newSelectedCollections[payload],
      selectedNftsData: newSelectedNftsData,
    }
    return { ...state, selectedCollections: newSelectedCollections }
  }
  if (type === 'updateNftId') {
    const newSelectedCollections = [...state.selectedCollections]
    const newSelectedNftsData = [
      ...state.selectedCollections[payload.collectionIndex].selectedNftsData,
    ]
    newSelectedNftsData[payload.nftIndex] = {
      ...newSelectedNftsData[payload.nftIndex],
      id: payload.id,
    }
    newSelectedCollections[payload.collectionIndex] = {
      ...newSelectedCollections[payload.collectionIndex],
      selectedNftsData: newSelectedNftsData,
    }
    return { ...state, selectedCollections: newSelectedCollections }
  }
  if (type === 'updateNftMinimumAmount') {
    const newSelectedCollections = [...state.selectedCollections]
    const newSelectedNftsData = [
      ...state.selectedCollections[payload.collectionIndex].selectedNftsData,
    ]
    newSelectedNftsData[payload.nftIndex] = {
      ...newSelectedNftsData[payload.nftIndex],
      minimumAmount: payload.amount,
    }
    newSelectedCollections[payload.collectionIndex] = {
      ...newSelectedCollections[payload.collectionIndex],
      selectedNftsData: newSelectedNftsData,
    }
    return { ...state, selectedCollections: newSelectedCollections }
  }
  if (type === 'deleteNft') {
    const newSelectedCollections = [...state.selectedCollections]
    const newSelectedNftsData = [
      ...state.selectedCollections[payload.collectionIndex].selectedNftsData,
    ]
    newSelectedNftsData.splice(payload.nftIndex, 1)
    newSelectedCollections[payload.collectionIndex] = {
      ...newSelectedCollections[payload.collectionIndex],
      selectedNftsData: newSelectedNftsData,
    }
    return { ...state, selectedCollections: newSelectedCollections }
  }

  throw new Error(`Unknown action type: ${type}`)
}
