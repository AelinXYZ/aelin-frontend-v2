export const DEPOSIT_TYPE = 'DEPOSIT_TYPE'
export const WITHDRAW_TYPE = 'WITHDRAW_TYPE'

export enum PoolTimelineState {
  'poolCreation' = 0,
  'investmentWindow' = 1,
  'dealCreation' = 2,
  'dealWindow' = 3,
  'roundInvestment' = 4,
  'vestingPeriod' = 5,
  'vestingCliff' = 6,
}
