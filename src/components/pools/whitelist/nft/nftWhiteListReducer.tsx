import { NftCollectionData } from '@/src/hooks/aelin/useNftCollectionLists'

export enum NftWhiteListStep {
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
  id: number
  nftId?: number
  minimumAmount: number
}

export type SelectedNftCollectionData = {
  nftCollectionData: NftCollectionData | undefined
  amountPerWallet?: number
  amountPerNft?: number
  selectedNftsData: SelectedNftData[]
  invalidNftIds: Set<number>
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
    default:
      throw new Error('Unexpected nft type')
  }
}

const getInitialSelectedNftsData = (nftType: NftType): SelectedNftData[] => {
  switch (nftType) {
    case NftType.erc721:
      return []
    case NftType.erc1155:
      return [{ id: 0, nftId: undefined, minimumAmount: 0 }]
  }
}

const getInitialSelectedCollection = (nftType: NftType): SelectedNftCollectionData => {
  return {
    nftCollectionData: undefined,
    amountPerNft: undefined,
    amountPerWallet: undefined,
    selectedNftsData: getInitialSelectedNftsData(nftType),
    invalidNftIds: new Set(),
  }
}

export const initialState: NftWhiteListState = {
  currentStep: NftWhiteListStep.whiteListProcess,
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
      payload: { index: number; amount?: number }
    }
  | {
      type: NftWhiteListActionType.updateAmountPerNft
      payload: { index: number; amount?: number }
    }
  | {
      type: NftWhiteListActionType.addEmptyNft
      payload: number
    }
  | {
      type: NftWhiteListActionType.updateNftId
      payload: { collectionIndex: number; nftIndex: number; nftId?: number }
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
  let newInvalidNftIds: Set<number>

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
      if (
        state.selectedCollections.some(
          (c) => c.nftCollectionData?.address === payload.newCollection.address,
        )
      ) {
        return { ...state }
      }
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
        {
          id:
            state.selectedCollections[payload].selectedNftsData[
              state.selectedCollections[payload].selectedNftsData.length - 1
            ].id + 1,
          nftId: undefined,
          minimumAmount: 0,
        },
      ]
      newSelectedCollections[payload] = {
        ...newSelectedCollections[payload],
        selectedNftsData: newSelectedNftsData,
      }
      return { ...state, selectedCollections: newSelectedCollections }
    case NftWhiteListActionType.updateNftId:
      newSelectedCollections = [...state.selectedCollections]
      newSelectedNftsData = [...state.selectedCollections[payload.collectionIndex].selectedNftsData]
      newInvalidNftIds = new Set(state.selectedCollections[payload.collectionIndex].invalidNftIds)
      if (!newInvalidNftIds.has(newSelectedNftsData[payload.nftIndex].id)) {
        const firstConflictingId = newSelectedNftsData.filter(
          (nftData) =>
            nftData.id !== newSelectedNftsData[payload.nftIndex].id &&
            nftData.nftId === newSelectedNftsData[payload.nftIndex].nftId,
        )[0]?.id

        if (firstConflictingId) {
          newInvalidNftIds.delete(firstConflictingId)
        }
      }
      if (
        newSelectedNftsData.findIndex((nftData) =>
          nftData.nftId === undefined ? false : nftData.nftId === payload.nftId,
        ) === -1
      ) {
        newInvalidNftIds.delete(newSelectedNftsData[payload.nftIndex].id)
      } else {
        newInvalidNftIds.add(newSelectedNftsData[payload.nftIndex].id)
      }
      newSelectedNftsData[payload.nftIndex] = {
        ...newSelectedNftsData[payload.nftIndex],
        nftId: payload.nftId,
      }
      newSelectedCollections[payload.collectionIndex] = {
        ...newSelectedCollections[payload.collectionIndex],
        selectedNftsData: newSelectedNftsData,
        invalidNftIds: newInvalidNftIds,
      }
      return {
        ...state,
        selectedCollections: newSelectedCollections,
      }
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
      newInvalidNftIds = new Set(state.selectedCollections[payload.collectionIndex].invalidNftIds)
      if (
        newSelectedNftsData[payload.nftIndex].nftId !== undefined &&
        !newInvalidNftIds.has(newSelectedNftsData[payload.nftIndex].id)
      ) {
        const firstConflictingId = newSelectedNftsData.filter(
          (nftData) =>
            nftData.id !== newSelectedNftsData[payload.nftIndex].id &&
            nftData.nftId === newSelectedNftsData[payload.nftIndex].nftId,
        )[0]?.id

        if (firstConflictingId) {
          newInvalidNftIds.delete(firstConflictingId)
        }
      }
      newInvalidNftIds.delete(newSelectedNftsData[payload.nftIndex].id)
      newSelectedNftsData.splice(payload.nftIndex, 1)
      newSelectedCollections[payload.collectionIndex] = {
        ...newSelectedCollections[payload.collectionIndex],
        selectedNftsData: newSelectedNftsData,
        invalidNftIds: newInvalidNftIds,
      }
      return {
        ...state,
        selectedCollections: newSelectedCollections,
      }
  }
}
