import { SWRConfiguration } from 'swr'

import { VestingTokensQueryVariables } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/chains'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

type Props = {
  chainId: ChainsValues
  where: VestingTokensQueryVariables['where']
  config?: SWRConfiguration
}

const useGetVestingTokens = (variables: Props) => {
  const allSDK = getAllGqlSDK()
  const { useVestingTokens } = allSDK[variables.chainId]

  const { data, error, mutate } = useVestingTokens(
    {
      where: variables.where,
    },
    variables.config,
  )

  return { data, error, mutate }
}

export default useGetVestingTokens
