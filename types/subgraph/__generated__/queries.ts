import { GraphQLClient } from 'graphql-request'
import { ClientError } from 'graphql-request/dist/types'
import * as Dom from 'graphql-request/dist/types.dom'
import gql from 'graphql-tag'
import useSWR, { SWRConfiguration as SWRConfigInterface, Key as SWRKeyInterface } from 'swr'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  BigDecimal: any
  BigInt: any
  Bytes: any
}

export type AcceptDeal = {
  __typename?: 'AcceptDeal'
  /**  the fee going to Aelin stakers  */
  aelinFee: Scalars['BigInt']
  /**  the address of the deal  */
  dealAddress: Scalars['Bytes']
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
  /**  the address of the pool  */
  poolAddress: Scalars['Bytes']
  /**  the amount of pool tokens spent. will also equal the amount of deal tokens received  */
  poolTokenAmount: Scalars['BigInt']
  /**  the address of the deal token purchaser  */
  purchaser: Scalars['Bytes']
  /**  the fee going to the sponsor  */
  sponsorFee: Scalars['BigInt']
}

export type AcceptDeal_Filter = {
  aelinFee?: InputMaybe<Scalars['BigInt']>
  aelinFee_gt?: InputMaybe<Scalars['BigInt']>
  aelinFee_gte?: InputMaybe<Scalars['BigInt']>
  aelinFee_in?: InputMaybe<Array<Scalars['BigInt']>>
  aelinFee_lt?: InputMaybe<Scalars['BigInt']>
  aelinFee_lte?: InputMaybe<Scalars['BigInt']>
  aelinFee_not?: InputMaybe<Scalars['BigInt']>
  aelinFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  dealAddress?: InputMaybe<Scalars['Bytes']>
  dealAddress_contains?: InputMaybe<Scalars['Bytes']>
  dealAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  dealAddress_not?: InputMaybe<Scalars['Bytes']>
  dealAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  dealAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  poolAddress?: InputMaybe<Scalars['Bytes']>
  poolAddress_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  poolAddress_not?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  poolTokenAmount?: InputMaybe<Scalars['BigInt']>
  poolTokenAmount_gt?: InputMaybe<Scalars['BigInt']>
  poolTokenAmount_gte?: InputMaybe<Scalars['BigInt']>
  poolTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  poolTokenAmount_lt?: InputMaybe<Scalars['BigInt']>
  poolTokenAmount_lte?: InputMaybe<Scalars['BigInt']>
  poolTokenAmount_not?: InputMaybe<Scalars['BigInt']>
  poolTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaser?: InputMaybe<Scalars['Bytes']>
  purchaser_contains?: InputMaybe<Scalars['Bytes']>
  purchaser_in?: InputMaybe<Array<Scalars['Bytes']>>
  purchaser_not?: InputMaybe<Scalars['Bytes']>
  purchaser_not_contains?: InputMaybe<Scalars['Bytes']>
  purchaser_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  sponsorFee?: InputMaybe<Scalars['BigInt']>
  sponsorFee_gt?: InputMaybe<Scalars['BigInt']>
  sponsorFee_gte?: InputMaybe<Scalars['BigInt']>
  sponsorFee_in?: InputMaybe<Array<Scalars['BigInt']>>
  sponsorFee_lt?: InputMaybe<Scalars['BigInt']>
  sponsorFee_lte?: InputMaybe<Scalars['BigInt']>
  sponsorFee_not?: InputMaybe<Scalars['BigInt']>
  sponsorFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum AcceptDeal_OrderBy {
  AelinFee = 'aelinFee',
  DealAddress = 'dealAddress',
  Id = 'id',
  PoolAddress = 'poolAddress',
  PoolTokenAmount = 'poolTokenAmount',
  Purchaser = 'purchaser',
  SponsorFee = 'sponsorFee',
}

export type AelinToken = {
  __typename?: 'AelinToken'
  /**  the number of decimals of the token  */
  decimals: Scalars['Int']
  /**  the address the token  */
  id: Scalars['ID']
  /**  the name of the token  */
  name: Scalars['String']
  /**  the symbol of the token  */
  symbol: Scalars['String']
}

export type AelinToken_Filter = {
  decimals?: InputMaybe<Scalars['Int']>
  decimals_gt?: InputMaybe<Scalars['Int']>
  decimals_gte?: InputMaybe<Scalars['Int']>
  decimals_in?: InputMaybe<Array<Scalars['Int']>>
  decimals_lt?: InputMaybe<Scalars['Int']>
  decimals_lte?: InputMaybe<Scalars['Int']>
  decimals_not?: InputMaybe<Scalars['Int']>
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  name?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_ends_with?: InputMaybe<Scalars['String']>
  name_gt?: InputMaybe<Scalars['String']>
  name_gte?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_lt?: InputMaybe<Scalars['String']>
  name_lte?: InputMaybe<Scalars['String']>
  name_not?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_ends_with?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  name_not_starts_with?: InputMaybe<Scalars['String']>
  name_starts_with?: InputMaybe<Scalars['String']>
  symbol?: InputMaybe<Scalars['String']>
  symbol_contains?: InputMaybe<Scalars['String']>
  symbol_ends_with?: InputMaybe<Scalars['String']>
  symbol_gt?: InputMaybe<Scalars['String']>
  symbol_gte?: InputMaybe<Scalars['String']>
  symbol_in?: InputMaybe<Array<Scalars['String']>>
  symbol_lt?: InputMaybe<Scalars['String']>
  symbol_lte?: InputMaybe<Scalars['String']>
  symbol_not?: InputMaybe<Scalars['String']>
  symbol_not_contains?: InputMaybe<Scalars['String']>
  symbol_not_ends_with?: InputMaybe<Scalars['String']>
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>
  symbol_not_starts_with?: InputMaybe<Scalars['String']>
  symbol_starts_with?: InputMaybe<Scalars['String']>
}

export enum AelinToken_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  Name = 'name',
  Symbol = 'symbol',
}

/** The block at which the query should be executed. */
export type Block_Height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['Bytes']>
  /** Value containing a block number */
  number?: InputMaybe<Scalars['Int']>
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
  number_gte?: InputMaybe<Scalars['Int']>
}

export type ClaimedUnderlyingDealToken = {
  __typename?: 'ClaimedUnderlyingDealToken'
  /**  the address of the deal contract  */
  dealAddress: Scalars['Bytes']
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
  /**  address of the claim recipient. when sending deal tokens, both the sender and recipient need to claim their vested tokens; gas fees are paid by the sender  */
  recipient: Scalars['Bytes']
  /**  the address of the underlying deal token  */
  underlyingDealTokenAddress: Scalars['Bytes']
  /**  the number of underlying deal tokens claimed  */
  underlyingDealTokensClaimed: Scalars['BigInt']
}

export type ClaimedUnderlyingDealToken_Filter = {
  dealAddress?: InputMaybe<Scalars['Bytes']>
  dealAddress_contains?: InputMaybe<Scalars['Bytes']>
  dealAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  dealAddress_not?: InputMaybe<Scalars['Bytes']>
  dealAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  dealAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  recipient?: InputMaybe<Scalars['Bytes']>
  recipient_contains?: InputMaybe<Scalars['Bytes']>
  recipient_in?: InputMaybe<Array<Scalars['Bytes']>>
  recipient_not?: InputMaybe<Scalars['Bytes']>
  recipient_not_contains?: InputMaybe<Scalars['Bytes']>
  recipient_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  underlyingDealTokenAddress?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_contains?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  underlyingDealTokenAddress_not?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  underlyingDealTokensClaimed?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokensClaimed_gt?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokensClaimed_gte?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokensClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>
  underlyingDealTokensClaimed_lt?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokensClaimed_lte?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokensClaimed_not?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokensClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum ClaimedUnderlyingDealToken_OrderBy {
  DealAddress = 'dealAddress',
  Id = 'id',
  Recipient = 'recipient',
  UnderlyingDealTokenAddress = 'underlyingDealTokenAddress',
  UnderlyingDealTokensClaimed = 'underlyingDealTokensClaimed',
}

export type DealCreated = {
  __typename?: 'DealCreated'
  /**  the address of the deal  */
  id: Scalars['ID']
  /**  the name of the deal  */
  name: Scalars['String']
  /**  the address of the pool  */
  poolAddress: Scalars['Bytes']
  /**  the address of the sponsor  */
  sponsor: Scalars['Bytes']
  /**  the symbol of the deal  */
  symbol: Scalars['String']
}

export type DealCreated_Filter = {
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  name?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_ends_with?: InputMaybe<Scalars['String']>
  name_gt?: InputMaybe<Scalars['String']>
  name_gte?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_lt?: InputMaybe<Scalars['String']>
  name_lte?: InputMaybe<Scalars['String']>
  name_not?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_ends_with?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  name_not_starts_with?: InputMaybe<Scalars['String']>
  name_starts_with?: InputMaybe<Scalars['String']>
  poolAddress?: InputMaybe<Scalars['Bytes']>
  poolAddress_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  poolAddress_not?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  sponsor?: InputMaybe<Scalars['Bytes']>
  sponsor_contains?: InputMaybe<Scalars['Bytes']>
  sponsor_in?: InputMaybe<Array<Scalars['Bytes']>>
  sponsor_not?: InputMaybe<Scalars['Bytes']>
  sponsor_not_contains?: InputMaybe<Scalars['Bytes']>
  sponsor_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  symbol?: InputMaybe<Scalars['String']>
  symbol_contains?: InputMaybe<Scalars['String']>
  symbol_ends_with?: InputMaybe<Scalars['String']>
  symbol_gt?: InputMaybe<Scalars['String']>
  symbol_gte?: InputMaybe<Scalars['String']>
  symbol_in?: InputMaybe<Array<Scalars['String']>>
  symbol_lt?: InputMaybe<Scalars['String']>
  symbol_lte?: InputMaybe<Scalars['String']>
  symbol_not?: InputMaybe<Scalars['String']>
  symbol_not_contains?: InputMaybe<Scalars['String']>
  symbol_not_ends_with?: InputMaybe<Scalars['String']>
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>
  symbol_not_starts_with?: InputMaybe<Scalars['String']>
  symbol_starts_with?: InputMaybe<Scalars['String']>
}

export enum DealCreated_OrderBy {
  Id = 'id',
  Name = 'name',
  PoolAddress = 'poolAddress',
  Sponsor = 'sponsor',
  Symbol = 'symbol',
}

export type DealDetail = {
  __typename?: 'DealDetail'
  /**  the address of the holder of the underlying deal tokens who is receiving the underlying purchaser tokens  */
  holder: Scalars['Bytes']
  /**  the duration of the holder funding period  */
  holderFundingDuration: Scalars['BigInt']
  /**  the exipration of the holder funding period  */
  holderFundingExpiration: Scalars['BigInt']
  /**  the address of the deal  */
  id: Scalars['ID']
  /**  is the deal fully funded  */
  isDealFunded: Scalars['Boolean']
  /**  after the pro rata period, anyone who maxxed out their contribution during the pro rata period can now use their remaining pool shares to buy deal tokens until the deal is full  */
  openRedemptionPeriod: Scalars['BigInt']
  /**  the initial period in which a deal can be accepted by the purchaser according to their pro rata ownership of the deal  */
  proRataRedemptionPeriod: Scalars['BigInt']
  /**  the timestamp when the pro rata redemption period starts  */
  proRataRedemptionPeriodStart?: Maybe<Scalars['BigInt']>
  /**  the total amount of purchse tokens for the deal  */
  purchaseTokenTotalForDeal: Scalars['BigInt']
  /**  the underlying deal token address  */
  underlyingDealToken: Scalars['Bytes']
  /**  the underlying deal token decimals  */
  underlyingDealTokenDecimals: Scalars['Int']
  /**  the underlying deal token symbol  */
  underlyingDealTokenSymbol: Scalars['String']
  /**  the total amount of underlying deal tokens available for the deal  */
  underlyingDealTokenTotal: Scalars['BigInt']
  /**  the vesting cliff after which linear vesting starts  */
  vestingCliff: Scalars['BigInt']
  /**  the vesting period which is linear for all deals in v1  */
  vestingPeriod: Scalars['BigInt']
}

export type DealDetail_Filter = {
  holder?: InputMaybe<Scalars['Bytes']>
  holderFundingDuration?: InputMaybe<Scalars['BigInt']>
  holderFundingDuration_gt?: InputMaybe<Scalars['BigInt']>
  holderFundingDuration_gte?: InputMaybe<Scalars['BigInt']>
  holderFundingDuration_in?: InputMaybe<Array<Scalars['BigInt']>>
  holderFundingDuration_lt?: InputMaybe<Scalars['BigInt']>
  holderFundingDuration_lte?: InputMaybe<Scalars['BigInt']>
  holderFundingDuration_not?: InputMaybe<Scalars['BigInt']>
  holderFundingDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  holderFundingExpiration?: InputMaybe<Scalars['BigInt']>
  holderFundingExpiration_gt?: InputMaybe<Scalars['BigInt']>
  holderFundingExpiration_gte?: InputMaybe<Scalars['BigInt']>
  holderFundingExpiration_in?: InputMaybe<Array<Scalars['BigInt']>>
  holderFundingExpiration_lt?: InputMaybe<Scalars['BigInt']>
  holderFundingExpiration_lte?: InputMaybe<Scalars['BigInt']>
  holderFundingExpiration_not?: InputMaybe<Scalars['BigInt']>
  holderFundingExpiration_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  holder_contains?: InputMaybe<Scalars['Bytes']>
  holder_in?: InputMaybe<Array<Scalars['Bytes']>>
  holder_not?: InputMaybe<Scalars['Bytes']>
  holder_not_contains?: InputMaybe<Scalars['Bytes']>
  holder_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  isDealFunded?: InputMaybe<Scalars['Boolean']>
  isDealFunded_in?: InputMaybe<Array<Scalars['Boolean']>>
  isDealFunded_not?: InputMaybe<Scalars['Boolean']>
  isDealFunded_not_in?: InputMaybe<Array<Scalars['Boolean']>>
  openRedemptionPeriod?: InputMaybe<Scalars['BigInt']>
  openRedemptionPeriod_gt?: InputMaybe<Scalars['BigInt']>
  openRedemptionPeriod_gte?: InputMaybe<Scalars['BigInt']>
  openRedemptionPeriod_in?: InputMaybe<Array<Scalars['BigInt']>>
  openRedemptionPeriod_lt?: InputMaybe<Scalars['BigInt']>
  openRedemptionPeriod_lte?: InputMaybe<Scalars['BigInt']>
  openRedemptionPeriod_not?: InputMaybe<Scalars['BigInt']>
  openRedemptionPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  proRataRedemptionPeriod?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriodStart?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriodStart_gt?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriodStart_gte?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriodStart_in?: InputMaybe<Array<Scalars['BigInt']>>
  proRataRedemptionPeriodStart_lt?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriodStart_lte?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriodStart_not?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriodStart_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  proRataRedemptionPeriod_gt?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriod_gte?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriod_in?: InputMaybe<Array<Scalars['BigInt']>>
  proRataRedemptionPeriod_lt?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriod_lte?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriod_not?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseTokenTotalForDeal?: InputMaybe<Scalars['BigInt']>
  purchaseTokenTotalForDeal_gt?: InputMaybe<Scalars['BigInt']>
  purchaseTokenTotalForDeal_gte?: InputMaybe<Scalars['BigInt']>
  purchaseTokenTotalForDeal_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseTokenTotalForDeal_lt?: InputMaybe<Scalars['BigInt']>
  purchaseTokenTotalForDeal_lte?: InputMaybe<Scalars['BigInt']>
  purchaseTokenTotalForDeal_not?: InputMaybe<Scalars['BigInt']>
  purchaseTokenTotalForDeal_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  underlyingDealToken?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenDecimals?: InputMaybe<Scalars['Int']>
  underlyingDealTokenDecimals_gt?: InputMaybe<Scalars['Int']>
  underlyingDealTokenDecimals_gte?: InputMaybe<Scalars['Int']>
  underlyingDealTokenDecimals_in?: InputMaybe<Array<Scalars['Int']>>
  underlyingDealTokenDecimals_lt?: InputMaybe<Scalars['Int']>
  underlyingDealTokenDecimals_lte?: InputMaybe<Scalars['Int']>
  underlyingDealTokenDecimals_not?: InputMaybe<Scalars['Int']>
  underlyingDealTokenDecimals_not_in?: InputMaybe<Array<Scalars['Int']>>
  underlyingDealTokenSymbol?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_contains?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_ends_with?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_gt?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_gte?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_in?: InputMaybe<Array<Scalars['String']>>
  underlyingDealTokenSymbol_lt?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_lte?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_not?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_not_contains?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_not_ends_with?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_not_in?: InputMaybe<Array<Scalars['String']>>
  underlyingDealTokenSymbol_not_starts_with?: InputMaybe<Scalars['String']>
  underlyingDealTokenSymbol_starts_with?: InputMaybe<Scalars['String']>
  underlyingDealTokenTotal?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenTotal_gt?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenTotal_gte?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenTotal_in?: InputMaybe<Array<Scalars['BigInt']>>
  underlyingDealTokenTotal_lt?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenTotal_lte?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenTotal_not?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenTotal_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  underlyingDealToken_contains?: InputMaybe<Scalars['Bytes']>
  underlyingDealToken_in?: InputMaybe<Array<Scalars['Bytes']>>
  underlyingDealToken_not?: InputMaybe<Scalars['Bytes']>
  underlyingDealToken_not_contains?: InputMaybe<Scalars['Bytes']>
  underlyingDealToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  vestingCliff?: InputMaybe<Scalars['BigInt']>
  vestingCliff_gt?: InputMaybe<Scalars['BigInt']>
  vestingCliff_gte?: InputMaybe<Scalars['BigInt']>
  vestingCliff_in?: InputMaybe<Array<Scalars['BigInt']>>
  vestingCliff_lt?: InputMaybe<Scalars['BigInt']>
  vestingCliff_lte?: InputMaybe<Scalars['BigInt']>
  vestingCliff_not?: InputMaybe<Scalars['BigInt']>
  vestingCliff_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  vestingPeriod?: InputMaybe<Scalars['BigInt']>
  vestingPeriod_gt?: InputMaybe<Scalars['BigInt']>
  vestingPeriod_gte?: InputMaybe<Scalars['BigInt']>
  vestingPeriod_in?: InputMaybe<Array<Scalars['BigInt']>>
  vestingPeriod_lt?: InputMaybe<Scalars['BigInt']>
  vestingPeriod_lte?: InputMaybe<Scalars['BigInt']>
  vestingPeriod_not?: InputMaybe<Scalars['BigInt']>
  vestingPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum DealDetail_OrderBy {
  Holder = 'holder',
  HolderFundingDuration = 'holderFundingDuration',
  HolderFundingExpiration = 'holderFundingExpiration',
  Id = 'id',
  IsDealFunded = 'isDealFunded',
  OpenRedemptionPeriod = 'openRedemptionPeriod',
  ProRataRedemptionPeriod = 'proRataRedemptionPeriod',
  ProRataRedemptionPeriodStart = 'proRataRedemptionPeriodStart',
  PurchaseTokenTotalForDeal = 'purchaseTokenTotalForDeal',
  UnderlyingDealToken = 'underlyingDealToken',
  UnderlyingDealTokenDecimals = 'underlyingDealTokenDecimals',
  UnderlyingDealTokenSymbol = 'underlyingDealTokenSymbol',
  UnderlyingDealTokenTotal = 'underlyingDealTokenTotal',
  VestingCliff = 'vestingCliff',
  VestingPeriod = 'vestingPeriod',
}

export type DealFullyFunded = {
  __typename?: 'DealFullyFunded'
  /**  the address of the deal  */
  id: Scalars['ID']
  /**  the end of the open redemption period  */
  openRedemptionExpiry: Scalars['BigInt']
  /**  the start of the open redemption period  */
  openRedemptionStart: Scalars['BigInt']
  /**  the address of the pool  */
  poolAddress: Scalars['Bytes']
  /**  the end of the pro rata redemption period  */
  proRataRedemptionExpiry: Scalars['BigInt']
  /**  the start of the pro rata redemption period  */
  proRataRedemptionStart: Scalars['BigInt']
}

export type DealFullyFunded_Filter = {
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  openRedemptionExpiry?: InputMaybe<Scalars['BigInt']>
  openRedemptionExpiry_gt?: InputMaybe<Scalars['BigInt']>
  openRedemptionExpiry_gte?: InputMaybe<Scalars['BigInt']>
  openRedemptionExpiry_in?: InputMaybe<Array<Scalars['BigInt']>>
  openRedemptionExpiry_lt?: InputMaybe<Scalars['BigInt']>
  openRedemptionExpiry_lte?: InputMaybe<Scalars['BigInt']>
  openRedemptionExpiry_not?: InputMaybe<Scalars['BigInt']>
  openRedemptionExpiry_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  openRedemptionStart?: InputMaybe<Scalars['BigInt']>
  openRedemptionStart_gt?: InputMaybe<Scalars['BigInt']>
  openRedemptionStart_gte?: InputMaybe<Scalars['BigInt']>
  openRedemptionStart_in?: InputMaybe<Array<Scalars['BigInt']>>
  openRedemptionStart_lt?: InputMaybe<Scalars['BigInt']>
  openRedemptionStart_lte?: InputMaybe<Scalars['BigInt']>
  openRedemptionStart_not?: InputMaybe<Scalars['BigInt']>
  openRedemptionStart_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  poolAddress?: InputMaybe<Scalars['Bytes']>
  poolAddress_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  poolAddress_not?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  proRataRedemptionExpiry?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionExpiry_gt?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionExpiry_gte?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionExpiry_in?: InputMaybe<Array<Scalars['BigInt']>>
  proRataRedemptionExpiry_lt?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionExpiry_lte?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionExpiry_not?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionExpiry_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  proRataRedemptionStart?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionStart_gt?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionStart_gte?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionStart_in?: InputMaybe<Array<Scalars['BigInt']>>
  proRataRedemptionStart_lt?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionStart_lte?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionStart_not?: InputMaybe<Scalars['BigInt']>
  proRataRedemptionStart_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum DealFullyFunded_OrderBy {
  Id = 'id',
  OpenRedemptionExpiry = 'openRedemptionExpiry',
  OpenRedemptionStart = 'openRedemptionStart',
  PoolAddress = 'poolAddress',
  ProRataRedemptionExpiry = 'proRataRedemptionExpiry',
  ProRataRedemptionStart = 'proRataRedemptionStart',
}

export type DepositDealToken = {
  __typename?: 'DepositDealToken'
  /**  the address of the deal contract  */
  dealContract: Scalars['Bytes']
  /**  the address of the depositor  */
  depositor: Scalars['Bytes']
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
  /**  the address of the underlying deal token  */
  underlyingDealTokenAddress: Scalars['Bytes']
  /**  the amount of underlying deal tokens deposited  */
  underlyingDealTokenAmount: Scalars['BigInt']
}

export type DepositDealToken_Filter = {
  dealContract?: InputMaybe<Scalars['Bytes']>
  dealContract_contains?: InputMaybe<Scalars['Bytes']>
  dealContract_in?: InputMaybe<Array<Scalars['Bytes']>>
  dealContract_not?: InputMaybe<Scalars['Bytes']>
  dealContract_not_contains?: InputMaybe<Scalars['Bytes']>
  dealContract_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  depositor?: InputMaybe<Scalars['Bytes']>
  depositor_contains?: InputMaybe<Scalars['Bytes']>
  depositor_in?: InputMaybe<Array<Scalars['Bytes']>>
  depositor_not?: InputMaybe<Scalars['Bytes']>
  depositor_not_contains?: InputMaybe<Scalars['Bytes']>
  depositor_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  underlyingDealTokenAddress?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_contains?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  underlyingDealTokenAddress_not?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  underlyingDealTokenAmount?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_gt?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_gte?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  underlyingDealTokenAmount_lt?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_lte?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_not?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum DepositDealToken_OrderBy {
  DealContract = 'dealContract',
  Depositor = 'depositor',
  Id = 'id',
  UnderlyingDealTokenAddress = 'underlyingDealTokenAddress',
  UnderlyingDealTokenAmount = 'underlyingDealTokenAmount',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type PoolCreated = {
  __typename?: 'PoolCreated'
  /**  the total amount of contributions to the pool  */
  contributions: Scalars['BigInt']
  /**  the address of the current proposed deal on the pool  */
  dealAddress?: Maybe<Scalars['Bytes']>
  /**  the duration of the pool assuming no deal is presented when purchasers can withdraw all of their locked funds  */
  duration: Scalars['BigInt']
  /**  if there is an allow list on the pool  */
  hasAllowList: Scalars['Boolean']
  /**  the address of the pool  */
  id: Scalars['ID']
  /**  represents the pool token name `aePool-${name}`  */
  name: Scalars['String']
  /**  the current status of the pool  */
  poolStatus: PoolStatus
  /**  the amount of time a purchaser gets to enter. After which the purchase period is locked.  */
  purchaseDuration: Scalars['BigInt']
  /**  the timestamp a purchaser can no longer enter the pool. After which the purchase period is locked.  */
  purchaseExpiry: Scalars['BigInt']
  /**  the address of the purchase token  */
  purchaseToken: Scalars['Bytes']
  /**  the cap on the amount of purchase tokens in the pool. If 0 - that means uncapped  */
  purchaseTokenCap: Scalars['BigInt']
  /**  the number of decimals on the purchase token  */
  purchaseTokenDecimals?: Maybe<Scalars['Int']>
  /**  the symbol of the purchase token  */
  purchaseTokenSymbol: Scalars['String']
  /**  the address of the sponsor for fee payments. only the msg.sender of the createPool method can be the sponsor  */
  sponsor: Scalars['Bytes']
  /**  the fee paid to the sponsor when a purchaser accepts a deal  */
  sponsorFee: Scalars['BigInt']
  /**  represents the pool token symbol `aeP-${symbol}`  */
  symbol: Scalars['String']
  /**  the block timestamp when the pool was created */
  timestamp: Scalars['BigInt']
  /**  the total supply of pool tokens  */
  totalSupply: Scalars['BigInt']
}

export type PoolCreated_Filter = {
  contributions?: InputMaybe<Scalars['BigInt']>
  contributions_gt?: InputMaybe<Scalars['BigInt']>
  contributions_gte?: InputMaybe<Scalars['BigInt']>
  contributions_in?: InputMaybe<Array<Scalars['BigInt']>>
  contributions_lt?: InputMaybe<Scalars['BigInt']>
  contributions_lte?: InputMaybe<Scalars['BigInt']>
  contributions_not?: InputMaybe<Scalars['BigInt']>
  contributions_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  dealAddress?: InputMaybe<Scalars['Bytes']>
  dealAddress_contains?: InputMaybe<Scalars['Bytes']>
  dealAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  dealAddress_not?: InputMaybe<Scalars['Bytes']>
  dealAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  dealAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  duration?: InputMaybe<Scalars['BigInt']>
  duration_gt?: InputMaybe<Scalars['BigInt']>
  duration_gte?: InputMaybe<Scalars['BigInt']>
  duration_in?: InputMaybe<Array<Scalars['BigInt']>>
  duration_lt?: InputMaybe<Scalars['BigInt']>
  duration_lte?: InputMaybe<Scalars['BigInt']>
  duration_not?: InputMaybe<Scalars['BigInt']>
  duration_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  hasAllowList?: InputMaybe<Scalars['Boolean']>
  hasAllowList_in?: InputMaybe<Array<Scalars['Boolean']>>
  hasAllowList_not?: InputMaybe<Scalars['Boolean']>
  hasAllowList_not_in?: InputMaybe<Array<Scalars['Boolean']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  name?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_ends_with?: InputMaybe<Scalars['String']>
  name_gt?: InputMaybe<Scalars['String']>
  name_gte?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_lt?: InputMaybe<Scalars['String']>
  name_lte?: InputMaybe<Scalars['String']>
  name_not?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_ends_with?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  name_not_starts_with?: InputMaybe<Scalars['String']>
  name_starts_with?: InputMaybe<Scalars['String']>
  poolStatus?: InputMaybe<PoolStatus>
  poolStatus_in?: InputMaybe<Array<PoolStatus>>
  poolStatus_not?: InputMaybe<PoolStatus>
  poolStatus_not_in?: InputMaybe<Array<PoolStatus>>
  purchaseDuration?: InputMaybe<Scalars['BigInt']>
  purchaseDuration_gt?: InputMaybe<Scalars['BigInt']>
  purchaseDuration_gte?: InputMaybe<Scalars['BigInt']>
  purchaseDuration_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseDuration_lt?: InputMaybe<Scalars['BigInt']>
  purchaseDuration_lte?: InputMaybe<Scalars['BigInt']>
  purchaseDuration_not?: InputMaybe<Scalars['BigInt']>
  purchaseDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseExpiry?: InputMaybe<Scalars['BigInt']>
  purchaseExpiry_gt?: InputMaybe<Scalars['BigInt']>
  purchaseExpiry_gte?: InputMaybe<Scalars['BigInt']>
  purchaseExpiry_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseExpiry_lt?: InputMaybe<Scalars['BigInt']>
  purchaseExpiry_lte?: InputMaybe<Scalars['BigInt']>
  purchaseExpiry_not?: InputMaybe<Scalars['BigInt']>
  purchaseExpiry_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseToken?: InputMaybe<Scalars['Bytes']>
  purchaseTokenCap?: InputMaybe<Scalars['BigInt']>
  purchaseTokenCap_gt?: InputMaybe<Scalars['BigInt']>
  purchaseTokenCap_gte?: InputMaybe<Scalars['BigInt']>
  purchaseTokenCap_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseTokenCap_lt?: InputMaybe<Scalars['BigInt']>
  purchaseTokenCap_lte?: InputMaybe<Scalars['BigInt']>
  purchaseTokenCap_not?: InputMaybe<Scalars['BigInt']>
  purchaseTokenCap_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseTokenDecimals?: InputMaybe<Scalars['Int']>
  purchaseTokenDecimals_gt?: InputMaybe<Scalars['Int']>
  purchaseTokenDecimals_gte?: InputMaybe<Scalars['Int']>
  purchaseTokenDecimals_in?: InputMaybe<Array<Scalars['Int']>>
  purchaseTokenDecimals_lt?: InputMaybe<Scalars['Int']>
  purchaseTokenDecimals_lte?: InputMaybe<Scalars['Int']>
  purchaseTokenDecimals_not?: InputMaybe<Scalars['Int']>
  purchaseTokenDecimals_not_in?: InputMaybe<Array<Scalars['Int']>>
  purchaseTokenSymbol?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_contains?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_ends_with?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_gt?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_gte?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_in?: InputMaybe<Array<Scalars['String']>>
  purchaseTokenSymbol_lt?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_lte?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_not?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_not_contains?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_not_ends_with?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_not_in?: InputMaybe<Array<Scalars['String']>>
  purchaseTokenSymbol_not_starts_with?: InputMaybe<Scalars['String']>
  purchaseTokenSymbol_starts_with?: InputMaybe<Scalars['String']>
  purchaseToken_contains?: InputMaybe<Scalars['Bytes']>
  purchaseToken_in?: InputMaybe<Array<Scalars['Bytes']>>
  purchaseToken_not?: InputMaybe<Scalars['Bytes']>
  purchaseToken_not_contains?: InputMaybe<Scalars['Bytes']>
  purchaseToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  sponsor?: InputMaybe<Scalars['Bytes']>
  sponsorFee?: InputMaybe<Scalars['BigInt']>
  sponsorFee_gt?: InputMaybe<Scalars['BigInt']>
  sponsorFee_gte?: InputMaybe<Scalars['BigInt']>
  sponsorFee_in?: InputMaybe<Array<Scalars['BigInt']>>
  sponsorFee_lt?: InputMaybe<Scalars['BigInt']>
  sponsorFee_lte?: InputMaybe<Scalars['BigInt']>
  sponsorFee_not?: InputMaybe<Scalars['BigInt']>
  sponsorFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  sponsor_contains?: InputMaybe<Scalars['Bytes']>
  sponsor_in?: InputMaybe<Array<Scalars['Bytes']>>
  sponsor_not?: InputMaybe<Scalars['Bytes']>
  sponsor_not_contains?: InputMaybe<Scalars['Bytes']>
  sponsor_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  symbol?: InputMaybe<Scalars['String']>
  symbol_contains?: InputMaybe<Scalars['String']>
  symbol_ends_with?: InputMaybe<Scalars['String']>
  symbol_gt?: InputMaybe<Scalars['String']>
  symbol_gte?: InputMaybe<Scalars['String']>
  symbol_in?: InputMaybe<Array<Scalars['String']>>
  symbol_lt?: InputMaybe<Scalars['String']>
  symbol_lte?: InputMaybe<Scalars['String']>
  symbol_not?: InputMaybe<Scalars['String']>
  symbol_not_contains?: InputMaybe<Scalars['String']>
  symbol_not_ends_with?: InputMaybe<Scalars['String']>
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>
  symbol_not_starts_with?: InputMaybe<Scalars['String']>
  symbol_starts_with?: InputMaybe<Scalars['String']>
  timestamp?: InputMaybe<Scalars['BigInt']>
  timestamp_gt?: InputMaybe<Scalars['BigInt']>
  timestamp_gte?: InputMaybe<Scalars['BigInt']>
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>
  timestamp_lt?: InputMaybe<Scalars['BigInt']>
  timestamp_lte?: InputMaybe<Scalars['BigInt']>
  timestamp_not?: InputMaybe<Scalars['BigInt']>
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  totalSupply?: InputMaybe<Scalars['BigInt']>
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>
  totalSupply_not?: InputMaybe<Scalars['BigInt']>
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum PoolCreated_OrderBy {
  Contributions = 'contributions',
  DealAddress = 'dealAddress',
  Duration = 'duration',
  HasAllowList = 'hasAllowList',
  Id = 'id',
  Name = 'name',
  PoolStatus = 'poolStatus',
  PurchaseDuration = 'purchaseDuration',
  PurchaseExpiry = 'purchaseExpiry',
  PurchaseToken = 'purchaseToken',
  PurchaseTokenCap = 'purchaseTokenCap',
  PurchaseTokenDecimals = 'purchaseTokenDecimals',
  PurchaseTokenSymbol = 'purchaseTokenSymbol',
  Sponsor = 'sponsor',
  SponsorFee = 'sponsorFee',
  Symbol = 'symbol',
  Timestamp = 'timestamp',
  TotalSupply = 'totalSupply',
}

export enum PoolStatus {
  DealOpen = 'DealOpen',
  FundingDeal = 'FundingDeal',
  PoolOpen = 'PoolOpen',
}

export type PurchasePoolToken = {
  __typename?: 'PurchasePoolToken'
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
  /**  the address of the pool  */
  poolAddress: Scalars['Bytes']
  /**  the amount of purchase tokens spent  */
  purchaseTokenAmount: Scalars['BigInt']
  /**  the address of the pool token purchaser  */
  purchaser: Scalars['Bytes']
  /**  the timestamp the purchase was made  */
  timestamp: Scalars['BigInt']
}

export type PurchasePoolToken_Filter = {
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  poolAddress?: InputMaybe<Scalars['Bytes']>
  poolAddress_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  poolAddress_not?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  purchaseTokenAmount?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_gt?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_gte?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseTokenAmount_lt?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_lte?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_not?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaser?: InputMaybe<Scalars['Bytes']>
  purchaser_contains?: InputMaybe<Scalars['Bytes']>
  purchaser_in?: InputMaybe<Array<Scalars['Bytes']>>
  purchaser_not?: InputMaybe<Scalars['Bytes']>
  purchaser_not_contains?: InputMaybe<Scalars['Bytes']>
  purchaser_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  timestamp?: InputMaybe<Scalars['BigInt']>
  timestamp_gt?: InputMaybe<Scalars['BigInt']>
  timestamp_gte?: InputMaybe<Scalars['BigInt']>
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>
  timestamp_lt?: InputMaybe<Scalars['BigInt']>
  timestamp_lte?: InputMaybe<Scalars['BigInt']>
  timestamp_not?: InputMaybe<Scalars['BigInt']>
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum PurchasePoolToken_OrderBy {
  Id = 'id',
  PoolAddress = 'poolAddress',
  PurchaseTokenAmount = 'purchaseTokenAmount',
  Purchaser = 'purchaser',
  Timestamp = 'timestamp',
}

export type Query = {
  __typename?: 'Query'
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>
  acceptDeal?: Maybe<AcceptDeal>
  acceptDeals: Array<AcceptDeal>
  aelinToken?: Maybe<AelinToken>
  aelinTokens: Array<AelinToken>
  claimedUnderlyingDealToken?: Maybe<ClaimedUnderlyingDealToken>
  claimedUnderlyingDealTokens: Array<ClaimedUnderlyingDealToken>
  dealCreated?: Maybe<DealCreated>
  dealCreateds: Array<DealCreated>
  dealDetail?: Maybe<DealDetail>
  dealDetails: Array<DealDetail>
  dealFullyFunded?: Maybe<DealFullyFunded>
  dealFullyFundeds: Array<DealFullyFunded>
  depositDealToken?: Maybe<DepositDealToken>
  depositDealTokens: Array<DepositDealToken>
  poolCreated?: Maybe<PoolCreated>
  poolCreateds: Array<PoolCreated>
  purchasePoolToken?: Maybe<PurchasePoolToken>
  purchasePoolTokens: Array<PurchasePoolToken>
  setHolder?: Maybe<SetHolder>
  setHolders: Array<SetHolder>
  setSponsor?: Maybe<SetSponsor>
  setSponsors: Array<SetSponsor>
  totalPoolsCreated?: Maybe<TotalPoolsCreated>
  totalPoolsCreateds: Array<TotalPoolsCreated>
  transfer?: Maybe<Transfer>
  transfers: Array<Transfer>
  withdrawFromPool?: Maybe<WithdrawFromPool>
  withdrawFromPools: Array<WithdrawFromPool>
  withdrawUnderlyingDealToken?: Maybe<WithdrawUnderlyingDealToken>
  withdrawUnderlyingDealTokens: Array<WithdrawUnderlyingDealToken>
}

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>
}

export type QueryAcceptDealArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryAcceptDealsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<AcceptDeal_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<AcceptDeal_Filter>
}

export type QueryAelinTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryAelinTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<AelinToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<AelinToken_Filter>
}

export type QueryClaimedUnderlyingDealTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryClaimedUnderlyingDealTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<ClaimedUnderlyingDealToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<ClaimedUnderlyingDealToken_Filter>
}

export type QueryDealCreatedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryDealCreatedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<DealCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<DealCreated_Filter>
}

export type QueryDealDetailArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryDealDetailsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<DealDetail_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<DealDetail_Filter>
}

export type QueryDealFullyFundedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryDealFullyFundedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<DealFullyFunded_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<DealFullyFunded_Filter>
}

export type QueryDepositDealTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryDepositDealTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<DepositDealToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<DepositDealToken_Filter>
}

export type QueryPoolCreatedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPoolCreatedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<PoolCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PoolCreated_Filter>
}

export type QueryPurchasePoolTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPurchasePoolTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<PurchasePoolToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PurchasePoolToken_Filter>
}

export type QuerySetHolderArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QuerySetHoldersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<SetHolder_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<SetHolder_Filter>
}

export type QuerySetSponsorArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QuerySetSponsorsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<SetSponsor_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<SetSponsor_Filter>
}

export type QueryTotalPoolsCreatedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryTotalPoolsCreatedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<TotalPoolsCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<TotalPoolsCreated_Filter>
}

export type QueryTransferArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryTransfersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Transfer_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Transfer_Filter>
}

export type QueryWithdrawFromPoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryWithdrawFromPoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<WithdrawFromPool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<WithdrawFromPool_Filter>
}

export type QueryWithdrawUnderlyingDealTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryWithdrawUnderlyingDealTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<WithdrawUnderlyingDealToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<WithdrawUnderlyingDealToken_Filter>
}

export type SetHolder = {
  __typename?: 'SetHolder'
  /**  the address of the new holder  */
  holder: Scalars['Bytes']
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
}

export type SetHolder_Filter = {
  holder?: InputMaybe<Scalars['Bytes']>
  holder_contains?: InputMaybe<Scalars['Bytes']>
  holder_in?: InputMaybe<Array<Scalars['Bytes']>>
  holder_not?: InputMaybe<Scalars['Bytes']>
  holder_not_contains?: InputMaybe<Scalars['Bytes']>
  holder_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
}

export enum SetHolder_OrderBy {
  Holder = 'holder',
  Id = 'id',
}

export type SetSponsor = {
  __typename?: 'SetSponsor'
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
  /**  the address of the new sponsor  */
  sponsor: Scalars['Bytes']
}

export type SetSponsor_Filter = {
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  sponsor?: InputMaybe<Scalars['Bytes']>
  sponsor_contains?: InputMaybe<Scalars['Bytes']>
  sponsor_in?: InputMaybe<Array<Scalars['Bytes']>>
  sponsor_not?: InputMaybe<Scalars['Bytes']>
  sponsor_not_contains?: InputMaybe<Scalars['Bytes']>
  sponsor_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum SetSponsor_OrderBy {
  Id = 'id',
  Sponsor = 'sponsor',
}

export type Subscription = {
  __typename?: 'Subscription'
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>
  acceptDeal?: Maybe<AcceptDeal>
  acceptDeals: Array<AcceptDeal>
  aelinToken?: Maybe<AelinToken>
  aelinTokens: Array<AelinToken>
  claimedUnderlyingDealToken?: Maybe<ClaimedUnderlyingDealToken>
  claimedUnderlyingDealTokens: Array<ClaimedUnderlyingDealToken>
  dealCreated?: Maybe<DealCreated>
  dealCreateds: Array<DealCreated>
  dealDetail?: Maybe<DealDetail>
  dealDetails: Array<DealDetail>
  dealFullyFunded?: Maybe<DealFullyFunded>
  dealFullyFundeds: Array<DealFullyFunded>
  depositDealToken?: Maybe<DepositDealToken>
  depositDealTokens: Array<DepositDealToken>
  poolCreated?: Maybe<PoolCreated>
  poolCreateds: Array<PoolCreated>
  purchasePoolToken?: Maybe<PurchasePoolToken>
  purchasePoolTokens: Array<PurchasePoolToken>
  setHolder?: Maybe<SetHolder>
  setHolders: Array<SetHolder>
  setSponsor?: Maybe<SetSponsor>
  setSponsors: Array<SetSponsor>
  totalPoolsCreated?: Maybe<TotalPoolsCreated>
  totalPoolsCreateds: Array<TotalPoolsCreated>
  transfer?: Maybe<Transfer>
  transfers: Array<Transfer>
  withdrawFromPool?: Maybe<WithdrawFromPool>
  withdrawFromPools: Array<WithdrawFromPool>
  withdrawUnderlyingDealToken?: Maybe<WithdrawUnderlyingDealToken>
  withdrawUnderlyingDealTokens: Array<WithdrawUnderlyingDealToken>
}

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>
}

export type SubscriptionAcceptDealArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionAcceptDealsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<AcceptDeal_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<AcceptDeal_Filter>
}

export type SubscriptionAelinTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionAelinTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<AelinToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<AelinToken_Filter>
}

export type SubscriptionClaimedUnderlyingDealTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionClaimedUnderlyingDealTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<ClaimedUnderlyingDealToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<ClaimedUnderlyingDealToken_Filter>
}

export type SubscriptionDealCreatedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionDealCreatedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<DealCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<DealCreated_Filter>
}

export type SubscriptionDealDetailArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionDealDetailsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<DealDetail_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<DealDetail_Filter>
}

export type SubscriptionDealFullyFundedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionDealFullyFundedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<DealFullyFunded_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<DealFullyFunded_Filter>
}

export type SubscriptionDepositDealTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionDepositDealTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<DepositDealToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<DepositDealToken_Filter>
}

export type SubscriptionPoolCreatedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPoolCreatedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<PoolCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PoolCreated_Filter>
}

export type SubscriptionPurchasePoolTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPurchasePoolTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<PurchasePoolToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PurchasePoolToken_Filter>
}

export type SubscriptionSetHolderArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionSetHoldersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<SetHolder_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<SetHolder_Filter>
}

export type SubscriptionSetSponsorArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionSetSponsorsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<SetSponsor_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<SetSponsor_Filter>
}

export type SubscriptionTotalPoolsCreatedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionTotalPoolsCreatedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<TotalPoolsCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<TotalPoolsCreated_Filter>
}

export type SubscriptionTransferArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionTransfersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Transfer_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Transfer_Filter>
}

export type SubscriptionWithdrawFromPoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionWithdrawFromPoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<WithdrawFromPool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<WithdrawFromPool_Filter>
}

export type SubscriptionWithdrawUnderlyingDealTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionWithdrawUnderlyingDealTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<WithdrawUnderlyingDealToken_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<WithdrawUnderlyingDealToken_Filter>
}

export type TotalPoolsCreated = {
  __typename?: 'TotalPoolsCreated'
  /**  the number of pools created - we use this for pagination  */
  count: Scalars['BigInt']
  /**  the id is always just 1  */
  id: Scalars['ID']
}

export type TotalPoolsCreated_Filter = {
  count?: InputMaybe<Scalars['BigInt']>
  count_gt?: InputMaybe<Scalars['BigInt']>
  count_gte?: InputMaybe<Scalars['BigInt']>
  count_in?: InputMaybe<Array<Scalars['BigInt']>>
  count_lt?: InputMaybe<Scalars['BigInt']>
  count_lte?: InputMaybe<Scalars['BigInt']>
  count_not?: InputMaybe<Scalars['BigInt']>
  count_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
}

export enum TotalPoolsCreated_OrderBy {
  Count = 'count',
  Id = 'id',
}

export type Transfer = {
  __typename?: 'Transfer'
  /**  the sender  */
  from: Scalars['Bytes']
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
  /**  the recipient  */
  to: Scalars['Bytes']
  /**  the amount sent  */
  value: Scalars['BigInt']
}

export type Transfer_Filter = {
  from?: InputMaybe<Scalars['Bytes']>
  from_contains?: InputMaybe<Scalars['Bytes']>
  from_in?: InputMaybe<Array<Scalars['Bytes']>>
  from_not?: InputMaybe<Scalars['Bytes']>
  from_not_contains?: InputMaybe<Scalars['Bytes']>
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  to?: InputMaybe<Scalars['Bytes']>
  to_contains?: InputMaybe<Scalars['Bytes']>
  to_in?: InputMaybe<Array<Scalars['Bytes']>>
  to_not?: InputMaybe<Scalars['Bytes']>
  to_not_contains?: InputMaybe<Scalars['Bytes']>
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  value?: InputMaybe<Scalars['BigInt']>
  value_gt?: InputMaybe<Scalars['BigInt']>
  value_gte?: InputMaybe<Scalars['BigInt']>
  value_in?: InputMaybe<Array<Scalars['BigInt']>>
  value_lt?: InputMaybe<Scalars['BigInt']>
  value_lte?: InputMaybe<Scalars['BigInt']>
  value_not?: InputMaybe<Scalars['BigInt']>
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum Transfer_OrderBy {
  From = 'from',
  Id = 'id',
  To = 'to',
  Value = 'value',
}

export type WithdrawFromPool = {
  __typename?: 'WithdrawFromPool'
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
  /**  the address of the pool  */
  poolAddress: Scalars['Bytes']
  /**  the amount of purchase tokens spent  */
  purchaseTokenAmount: Scalars['BigInt']
  /**  the address of the pool token purchaser  */
  purchaser: Scalars['Bytes']
}

export type WithdrawFromPool_Filter = {
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  poolAddress?: InputMaybe<Scalars['Bytes']>
  poolAddress_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  poolAddress_not?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  poolAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  purchaseTokenAmount?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_gt?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_gte?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaseTokenAmount_lt?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_lte?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_not?: InputMaybe<Scalars['BigInt']>
  purchaseTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  purchaser?: InputMaybe<Scalars['Bytes']>
  purchaser_contains?: InputMaybe<Scalars['Bytes']>
  purchaser_in?: InputMaybe<Array<Scalars['Bytes']>>
  purchaser_not?: InputMaybe<Scalars['Bytes']>
  purchaser_not_contains?: InputMaybe<Scalars['Bytes']>
  purchaser_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum WithdrawFromPool_OrderBy {
  Id = 'id',
  PoolAddress = 'poolAddress',
  PurchaseTokenAmount = 'purchaseTokenAmount',
  Purchaser = 'purchaser',
}

export type WithdrawUnderlyingDealToken = {
  __typename?: 'WithdrawUnderlyingDealToken'
  /**  the address of the deal contract  */
  dealContract: Scalars['Bytes']
  /**  the address of the depositor  */
  depositor: Scalars['Bytes']
  /**  the transaction hash + event log index of the purchase event  */
  id: Scalars['ID']
  /**  the address of the underlying deal token  */
  underlyingDealTokenAddress: Scalars['Bytes']
  /**  the amount of underlying deal tokens deposited  */
  underlyingDealTokenAmount: Scalars['BigInt']
}

export type WithdrawUnderlyingDealToken_Filter = {
  dealContract?: InputMaybe<Scalars['Bytes']>
  dealContract_contains?: InputMaybe<Scalars['Bytes']>
  dealContract_in?: InputMaybe<Array<Scalars['Bytes']>>
  dealContract_not?: InputMaybe<Scalars['Bytes']>
  dealContract_not_contains?: InputMaybe<Scalars['Bytes']>
  dealContract_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  depositor?: InputMaybe<Scalars['Bytes']>
  depositor_contains?: InputMaybe<Scalars['Bytes']>
  depositor_in?: InputMaybe<Array<Scalars['Bytes']>>
  depositor_not?: InputMaybe<Scalars['Bytes']>
  depositor_not_contains?: InputMaybe<Scalars['Bytes']>
  depositor_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  id?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_lt?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  underlyingDealTokenAddress?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_contains?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>
  underlyingDealTokenAddress_not?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>
  underlyingDealTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  underlyingDealTokenAmount?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_gt?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_gte?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  underlyingDealTokenAmount_lt?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_lte?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_not?: InputMaybe<Scalars['BigInt']>
  underlyingDealTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum WithdrawUnderlyingDealToken_OrderBy {
  DealContract = 'dealContract',
  Depositor = 'depositor',
  Id = 'id',
  UnderlyingDealTokenAddress = 'underlyingDealTokenAddress',
  UnderlyingDealTokenAmount = 'underlyingDealTokenAmount',
}

export type _Block_ = {
  __typename?: '_Block_'
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>
  /** The block number */
  number: Scalars['Int']
}

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_'
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_
  /** The deployment ID */
  deployment: Scalars['String']
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']
}

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny',
}

export type PoolsCreatedQueryVariables = Exact<{
  orderBy?: InputMaybe<PoolCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  where?: InputMaybe<PoolCreated_Filter>
}>

export type PoolsCreatedQuery = {
  __typename?: 'Query'
  poolCreateds: Array<{
    __typename?: 'PoolCreated'
    id: string
    name: string
    symbol: string
    purchaseTokenCap: any
    purchaseToken: any
    purchaseTokenSymbol: string
    duration: any
    sponsorFee: any
    sponsor: any
    purchaseDuration: any
    purchaseExpiry: any
    purchaseTokenDecimals?: number | null
    timestamp: any
    hasAllowList: boolean
    poolStatus: PoolStatus
    contributions: any
    totalSupply: any
    dealAddress?: any | null
  }>
}

export const PoolsCreatedDocument = gql`
  query poolsCreated(
    $orderBy: PoolCreated_orderBy
    $orderDirection: OrderDirection
    $where: PoolCreated_filter
  ) {
    poolCreateds(orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      name
      symbol
      purchaseTokenCap
      purchaseToken
      purchaseTokenSymbol
      duration
      sponsorFee
      sponsor
      purchaseDuration
      purchaseExpiry
      purchaseTokenDecimals
      timestamp
      hasAllowList
      poolStatus
      contributions
      totalSupply
      dealAddress
    }
  }
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action()

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    poolsCreated(
      variables?: PoolsCreatedQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<PoolsCreatedQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<PoolsCreatedQuery>(PoolsCreatedDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'poolsCreated',
        'query',
      )
    },
  }
}

export type Sdk = ReturnType<typeof getSdk>
export function getSdkWithHooks(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  const sdk = getSdk(client, withWrapper)
  const genKey = <V extends Record<string, unknown> = Record<string, unknown>>(
    name: string,
    object: V = {} as V,
  ): SWRKeyInterface => [
    name,
    ...Object.keys(object)
      .sort()
      .map((key) => object[key]),
  ]
  return {
    ...sdk,
    usePoolsCreated(
      variables?: PoolsCreatedQueryVariables,
      config?: SWRConfigInterface<PoolsCreatedQuery, ClientError>,
    ) {
      return useSWR<PoolsCreatedQuery, ClientError>(
        genKey<PoolsCreatedQueryVariables>('PoolsCreated', variables),
        () => sdk.poolsCreated(variables),
        config,
      )
    },
  }
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>
