import { VestingTokensQueryVariables } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/chains'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

type Props = {
  chainId: ChainsValues
  where: VestingTokensQueryVariables['where']
}

const useGetVestingTokens = (variables: Props) => {
  const allSDK = getAllGqlSDK()
  const { useVestingTokens } = allSDK[variables.chainId]

  const { data, error } = useVestingTokens({
    where: variables.where,
  })

  return { data, error }
}

export default useGetVestingTokens
