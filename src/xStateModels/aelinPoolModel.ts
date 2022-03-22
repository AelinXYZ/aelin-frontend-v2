import { ContextFrom, EventObject } from 'xstate'
import { createModel } from 'xstate/lib/model'

import { ParsedAelinPool } from '@/src/hooks/pools/useAelinPool'

function assertEvent<TEvent extends EventObject, Type extends TEvent['type']>(
  ev: TEvent,
  type: Type,
): asserts ev is Extract<TEvent, { type: Type }> {
  if (ev.type !== type) {
    throw new Error('Unexpected event type.')
  }
}

const model = createModel(
  {
    pool: {} as ParsedAelinPool,
  },
  {
    events: {
      POOL_UPDATED: (pool: ParsedAelinPool) => ({ pool }),
      APPROVE: (value: number) => ({ value }),
      DEPOSIT: (value: number) => ({ value }),
      DEAL: (deal: any) => ({ deal }),
    },
  },
)

function guardWaitingForDeal(context: ContextFrom<typeof model>) {
  console.log('guardWaitingForDeal')
  return false
}

export const aelinPoolMachine = model.createMachine(
  {
    initial: 'funding',
    context: model.initialContext,
    states: {
      funding: {
        always: [{ target: 'waitingForDeal', cond: guardWaitingForDeal.name }],
        on: {
          APPROVE: [
            {
              target: 'funding',
              //cond: 'isValidMove',
              //actions: 'updateBoard',
            },
          ],
          POOL_UPDATED: {
            actions: 'updatePool',
          },
        },
      },
      waitingForDeal: {
        on: {
          DEAL: {
            target: 'closed',
          },
        },
      },
      closed: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      updatePool: model.assign({
        pool: (_context, event) => {
          assertEvent(event, 'POOL_UPDATED')
          return event.pool
        },
      }),
      //   resetGame: model.reset(),
      //   setWinner: model.assign({
    },
    guards: {
      guardWaitingForDeal,
      //checkDraw,
      //isValidMove,
    },
  },
)
