export const DEPOSIT_TYPE = 'DEPOSIT_TYPE'
export const WITHDRAW_TYPE = 'WITHDRAW_TYPE'

export enum PoolTimelineState {
  'poolCreation' = 0,
  'investmentDeadline' = 1,
  'dealCreation' = 2,
  'dealDeadline' = 3,
  'proRataRedemption' = 4,
  'openRedemption' = 5,
  'vestingCliff' = 6,
  'vestingPeriod' = 7,
}

export enum PoolTimelineStateTitles {
  'Pool Creation',
  'Investment Deadline',
  'Deal Creation',
  'Deal Funding Deadline',
  'Round 1: Accept Allocation',
  'Round 2: Accept Remaining',
  'Vesting Cliff',
  'Vesting Period',
}

export enum ThemeType {
  light = 'light',
  dark = 'dark',
}
