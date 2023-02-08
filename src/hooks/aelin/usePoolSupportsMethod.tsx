import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { useAelinPoolTransaction } from '../contracts/useAelinPoolTransaction'
import { useAelinPoolUpfrontDealTransaction } from '../contracts/useAelinPoolUpfrontDealTransaction'
import { ParsedAelinPool } from './useAelinPool'
import { ZERO_BN } from '@/src/constants/misc'
import { AelinPool, AelinUpfrontDeal } from '@/types/typechain'

type AelinPoolMethodName = keyof AelinPool['functions']
type AelinUpFrontDealMethodName = keyof AelinUpfrontDeal['functions']

export function usePoolSupportsMethod(
  pool: ParsedAelinPool,
  methodName: AelinPoolMethodName | AelinUpFrontDealMethodName,
) {
  const [estimateResult, setEstimateResult] = useState<any>()

  const { estimate: estimatePool } = useAelinPoolTransaction(
    pool.address,
    methodName as AelinPoolMethodName,
  )

  const { estimate: estimateUpFrontDeal } = useAelinPoolUpfrontDealTransaction(
    pool.address,
    methodName as AelinUpFrontDealMethodName,
  )

  const isUpfrontDeal = !!pool.upfrontDeal

  useEffect(() => {
    if (isUpfrontDeal) {
      estimateUpFrontDeal().then(setEstimateResult)
    } else {
      estimatePool().then(setEstimateResult)
    }
  }, [estimatePool, estimateUpFrontDeal, isUpfrontDeal])

  return (
    !!estimateResult &&
    Object.values(estimateResult).some((result) => BigNumber.from(result).gt(ZERO_BN))
  )
}
