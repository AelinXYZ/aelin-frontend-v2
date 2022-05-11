export const DEPOSIT_TYPE = 'DEPOSIT_TYPE'
export const WITHDRAW_TYPE = 'WITHDRAW_TYPE'

export enum PoolTimelineState {
  'poolCreation' = 0,
  'investmentWindow' = 1,
  'dealCreation' = 2,
  'dealWindow' = 3,
  'proRataRedemption' = 4,
  'openRedemption' = 5,
  'vestingCliff' = 6,
  'vestingPeriod' = 7,
}

export enum PoolTimelineStateTitles {
  'Pool Creation',
  'Investment Window',
  'Deal Creation',
  'Deal Window',
  'Pro Rata Redemption',
  'Open Redemption',
  'Vesting Cliff',
  'Vesting Period',
}
