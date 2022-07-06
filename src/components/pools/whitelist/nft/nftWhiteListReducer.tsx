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

const getInitialSelectedNftsData = (nftType: NftType): SelectedNftData[] => {
  switch (nftType) {
    case NftType.erc721:
      return []
    case NftType.erc1155:
      return [{ id: '', minimumAmount: 0 }]
  }
}

const getInitialSelectedCollection = (nftType: NftType): SelectedNftCollectionData => {
  return {
    nftCollectionData: undefined,
    amountPerNft: 0,
    amountPerWallet: 0,
    selectedNftsData: getInitialSelectedNftsData(nftType),
  }
}

export const initialState: NftWhiteListState = {
  currentStep: NftWhiteListStep.nftType,
  nftType: NftType.erc721,
  whiteListProcess: getInitialNftWhitelistProcess(NftType.erc721),
  selectedCollections: [getInitialSelectedCollection(NftType.erc721)],
}

export enum NftWhiteListActionType {
  updateStep,
  updateNftType,
  updateWhiteListProcess,
  addEmptyCollection,
  updateCollection,
  removeCollection,
  updateAmountPerWallet,
  updateAmountPerNft,
  addEmptyNft,
  updateNftId,
  updateNftMinimumAmount,
  deleteNft,
}

export type NftWhiteListAction =
  | {
      type: NftWhiteListActionType.updateStep
      payload: NftWhiteListStep
    }
  | {
      type: NftWhiteListActionType.updateNftType
      payload: NftType
    }
  | {
      type: NftWhiteListActionType.updateWhiteListProcess
      payload: NftWhitelistProcess
    }
  | {
      type: NftWhiteListActionType.addEmptyCollection
      payload: undefined
    }
  | {
      type: NftWhiteListActionType.updateCollection
      payload: { index: number; newCollection: NftCollectionData }
    }
  | {
      type: NftWhiteListActionType.removeCollection
      payload: number
    }
  | {
      type: NftWhiteListActionType.updateAmountPerWallet
      payload: { index: number; amount: number }
    }
  | {
      type: NftWhiteListActionType.updateAmountPerNft
      payload: { index: number; amount: number }
    }
  | {
      type: NftWhiteListActionType.addEmptyNft
      payload: number
    }
  | {
      type: NftWhiteListActionType.updateNftId
      payload: { collectionIndex: number; nftIndex: number; id: string }
    }
  | {
      type: NftWhiteListActionType.updateNftMinimumAmount
      payload: { collectionIndex: number; nftIndex: number; amount: number }
    }
  | {
      type: NftWhiteListActionType.deleteNft
      payload: { collectionIndex: number; nftIndex: number }
    }

export const nftWhiteListReducer = (
  state: NftWhiteListState,
  action: NftWhiteListAction,
): NftWhiteListState => {
  const { payload, type } = action
  let newSelectedCollections: SelectedNftCollectionData[]
  let newSelectedNftsData: SelectedNftData[]

  switch (type) {
    case NftWhiteListActionType.updateStep:
      return { ...state, currentStep: payload }
    case NftWhiteListActionType.updateNftType:
      return {
        ...state,
        nftType: payload,
        whiteListProcess: getInitialNftWhitelistProcess(payload),
        selectedCollections: [getInitialSelectedCollection(payload)],
      }
    case NftWhiteListActionType.updateWhiteListProcess:
      return {
        ...state,
        whiteListProcess: payload,
        selectedCollections: [getInitialSelectedCollection(state.nftType)],
      }
    case NftWhiteListActionType.addEmptyCollection:
      return {
        ...state,
        selectedCollections: [
          ...state.selectedCollections,
          getInitialSelectedCollection(state.nftType),
        ],
      }
    case NftWhiteListActionType.updateCollection:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedCollections[payload.index].nftCollectionData = payload.newCollection
      newSelectedCollections[payload.index].selectedNftsData = getInitialSelectedNftsData(
        state.nftType,
      )
      return { ...state, selectedCollections: newSelectedCollections }
    case NftWhiteListActionType.removeCollection:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedCollections.splice(payload, 1)
      return { ...state, selectedCollections: newSelectedCollections }
    case NftWhiteListActionType.updateAmountPerWallet:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedCollections[payload.index] = {
        ...newSelectedCollections[payload.index],
        amountPerWallet: payload.amount,
      }
      return { ...state, selectedCollections: newSelectedCollections }
    case NftWhiteListActionType.updateAmountPerNft:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedCollections[payload.index] = {
        ...newSelectedCollections[payload.index],
        amountPerNft: payload.amount,
      }
      return { ...state, selectedCollections: newSelectedCollections }
    case NftWhiteListActionType.addEmptyNft:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedNftsData = [
        ...state.selectedCollections[payload].selectedNftsData,
        { id: '', minimumAmount: 0 },
      ]
      newSelectedCollections[payload] = {
        ...newSelectedCollections[payload],
        selectedNftsData: newSelectedNftsData,
      }
      return { ...state, selectedCollections: newSelectedCollections }
    case NftWhiteListActionType.updateNftId:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedNftsData = [...state.selectedCollections[payload.collectionIndex].selectedNftsData]
      newSelectedNftsData[payload.nftIndex] = {
        ...newSelectedNftsData[payload.nftIndex],
        id: payload.id,
      }
      newSelectedCollections[payload.collectionIndex] = {
        ...newSelectedCollections[payload.collectionIndex],
        selectedNftsData: newSelectedNftsData,
      }
      return { ...state, selectedCollections: newSelectedCollections }
    case NftWhiteListActionType.updateNftMinimumAmount:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedNftsData = [...state.selectedCollections[payload.collectionIndex].selectedNftsData]
      newSelectedNftsData[payload.nftIndex] = {
        ...newSelectedNftsData[payload.nftIndex],
        minimumAmount: payload.amount,
      }
      newSelectedCollections[payload.collectionIndex] = {
        ...newSelectedCollections[payload.collectionIndex],
        selectedNftsData: newSelectedNftsData,
      }
      return { ...state, selectedCollections: newSelectedCollections }
    case NftWhiteListActionType.deleteNft:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedNftsData = [...state.selectedCollections[payload.collectionIndex].selectedNftsData]
      newSelectedNftsData.splice(payload.nftIndex, 1)
      newSelectedCollections[payload.collectionIndex] = {
        ...newSelectedCollections[payload.collectionIndex],
        selectedNftsData: newSelectedNftsData,
      }
      return { ...state, selectedCollections: newSelectedCollections }
  }
}
