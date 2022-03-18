import { assign, createMachine } from 'xstate'

type Address = string

export interface poolContext {
  // Currency used to purchase pool tokens
  purchaseToken: Address | null
  // max number of pool token: 0 = uncapped or specific amount
  purchaseTokenCap: number
  // The amount of time purchasers have to purchase pool tokens
  purchaseExpiry: Date | null
  // The amount of time a sponsor has to find a deal before purchaser can withdraw their funds
  investmenDealLine: Date | null
  // the paid fee to the sponsor
  sponsorFee: number
  poolName: string | null
  poolSymbol: string | null
  isPrivate: boolean
}

export enum Action {
  fundingCheckPoolConditions = 'fundingCheckPoolConditions',
}

type OnFundingClose = { type: 'OnfundingClosed' }
type OnDeposit = { type: 'OnDeposit'; deposit: number }
type OnDealSubmitted = { type: 'OnDealSubmitted' }
type ClosePool = { type: 'ClosePool' }
type OnWithdraw = { type: 'OnWithdraw' }
type OnAcceptDeal = { type: 'OnAcceptDeal' }
type OnRedemptionStart = { type: 'OnRedemptionStart' }
type OnPoolEnded = { type: 'OnPoolEnded' }

type Event =
  | OnFundingClose
  | OnDeposit
  | OnDealSubmitted
  | ClosePool
  | OnWithdraw
  | OnAcceptDeal
  | OnRedemptionStart
  | OnPoolEnded

const newMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcD2qA2A6AYgVwDsIBLAqAYlQPyNKgGENVZJEVniAXYqtkAD0QAmAJwBWLAA4hYgAwBGAGyLZYgOySRaxQBoQAT0QAWI7KyK1AZiNy1sy7NmTFAXxd60mXIRJlKBABEwNFguPhCuHgI+QQQ1IywjeRlZRUl5OzSRPUMEBwSxIVlReUKhDKKjNw90bAB1AENIshxUACcghox-TowAZTwAIwBbLk5WJBAI7l5J2LShLBFHBVMxS0V5eSMcxAczOySNWW1kyQ3qqdqsRuaoVo6wLvIAYyYWAAVa8I4Z6LnEOdJEttOohOdFCJFEJdAZjCosJYhODLGolGoxFV3FcvLduC12gAJTAQMCPaavd5gL6YH6hP4xRBbEyI1JCSwbRRGCwaXZ5cpLMSlQpOVKSExiS6eepNfH3IkkslBClUOpcAAWEDaDQA7nTIrNQLEROClmyiuy1FDCnz5CJgZjUWJNql4qUsTVcbK6A9iRhSeTfv4AIIvF7BTi9fUMgEIE3yKSoowY2RQ+07OFxswiEROqzO1KWe1S654n0K-1K4JBqgAJUgYGGyD+fU4DTanGjUUZCGZCQc0I5ym5al5mfkSKw4OWahh0mURTUJa9d19isD9P8NIwAFEiBN2PTu7G+6zB5yR2PcjIRFgMopClohDYtvFl9ht4xmJB-GrOJrtT1SZpmPI0mTESQzGSNEizEdYILUPkNjUJZTCMGFYM2UR3ywVBkDAAh61JJs-i3Wo918KAu0NARwPUcwjBzOCH0kTFR1tSdpyceJlFUZ83GxAhUFJeBgOuGhKOo-4wIQZM+SOLATnsZkZCsDEPRxGVV3aKMxKPGjYiMTQp3kSQMSyDRMWceT0MUrlVHQh8inEHCywJNo-QDZVfiknszMWCxGOhaFig2SQkK2RTc3U1i3RnHDPypCBfJPaxgSwl9RHOVRYVyEwE3ZE4TCMSw5HFc4cLwgiiMbZtQKufTpNo3s0vMZJMvtBxnQ4yxzCtSEOXEIpNA06UsAANTgOUUpkioEjUkxp1MO0+RkBNnWkFENGfSxxXfGbmvZW1gRWRwklTNERAnASXCAA */
  createMachine<poolContext, Event>(
    {
      context: {
        purchaseToken: null,
        purchaseTokenCap: 0,
        purchaseExpiry: null,
        investmenDealLine: null,
        sponsorFee: 0,
        poolName: null,
        poolSymbol: null,
        isPrivate: false,
      },
      id: 'pool',
      initial: 'funding',
      states: {
        funding: {
          entry: Action.fundingCheckPoolConditions,
          on: {
            OnfundingClosed: {
              target: '#pool.WaitingForDeal',
            },
            OnDeposit: {
              actions: 'increasefunding',
              target: '#pool.funding',
            },
          },
        },
        WaitingForDeal: {
          on: {
            OnDealSubmitted: {
              target: '#pool.WaitingForHolderDeposit',
            },
            ClosePool: {
              target: '#pool.PoolClosed',
            },
          },
        },
        WaitingForHolderDeposit: {
          on: {
            ClosePool: {
              target: '#pool.PoolClosed',
            },
            OnWithdraw: {
              actions: 'rejectDeal',
              target: '#pool.WaitingForHolderDeposit',
            },
            OnAcceptDeal: {
              actions: 'acceptDeal',
              target: '#pool.WaitingForHolderDeposit',
            },
            OnRedemptionStart: {
              target: '#pool.openRedemption',
            },
            OnPoolEnded: {
              target: '#pool.Vesting',
            },
          },
        },
        PoolClosed: {
          type: 'final',
          on: {
            OnWithdraw: {
              actions: 'updatePoolStatus',
              target: '#pool.PoolClosed',
            },
          },
        },
        openRedemption: {
          on: {
            OnPoolEnded: {
              target: '#pool.Vesting',
            },
          },
        },
        Vesting: {},
      },
    },
    {
      // Global machine actions (using in events)
      actions: {
        [Action.fundingCheckPoolConditions]: (context, event: OnDeposit) => {
          // check if the pool is still open

          // check if max cap is reched

          // if needed transition to next state
          event.deposit
        },
      },
      services: {},
      guards: {},
    },
  )

export default newMachine
