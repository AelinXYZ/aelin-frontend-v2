export const DEPOSIT_TYPE = 'DEPOSIT_TYPE'
export const WITHDRAW_TYPE = 'WITHDRAW_TYPE'

export enum PoolTimelineState {
  PoolCreation,
  InvestmentDeadline,
  DealCreation,
  DealDeadline,
  Round1,
  Round2,
  VestingCliff,
  VestingPeriod,
  //UpfrontDeal
  UpfrontDealCreation,
  UpfrontDealRedemption,
  UpfrontDealVestingCliff,
  UpfrontDealVestingPeriod,
}

export enum PoolTimelineStateTitles {
  PoolCreation = 'Pool Creation',
  InvestmentDeadline = 'Investment Deadline',
  DealCreation = 'Deal Creation',
  HolderFundingDeadline = 'Holder Funding Deadline',
  Round1 = 'Round 1: Accept Allocation',
  Round2 = 'Round 2: Accept Remaining',
  VestingCliff = 'Vesting Cliff',
  VestingPeriod = 'Vesting Period',
  UpfrontDealCreation = 'Deal Creation',
  UpfrontDealRedemption = 'Deal Redemption',
  UpfrontDealVestingCliff = 'Vesting Cliff',
  UpfrontDealVestingPeriod = 'Vesting Period',
}

export enum ThemeType {
  light = 'light',
  dark = 'dark',
}
