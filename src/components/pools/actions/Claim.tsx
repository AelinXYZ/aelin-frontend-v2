import ms from 'ms'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Contents } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinDealTransaction } from '@/src/hooks/contracts/useAelinDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { formatToken } from '@/src/web3/bigNumber'

type Props = {
  pool: ParsedAelinPool
}

function Claim({ pool }: Props) {
  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const { estimate, execute: claim } = useAelinDealTransaction(
    pool.dealAddress || ZERO_ADDRESS,
    'claim',
  )
  const { data } = useVestingDealById(
    {
      id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.dealAddress}`,
    },
    { refreshInterval: ms('10s') },
  )

  const claimTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await claim([], txGasOptions)
      },
      title: `Claim ${data?.vestingDeal?.tokenToVestSymbol}`,
      estimate: () => estimate([]),
    })
  }

  const { remainingAmountToVest, totalVested, underlyingDealTokenDecimals } =
    data?.vestingDeal || {}
  const symbol = pool.deal?.underlyingToken.symbol
  return (
    <>
      <Contents>Your deal tokens can be claimed.</Contents>
      <p>
        {`Amount to claim: ${formatToken(
          remainingAmountToVest || 0,
          underlyingDealTokenDecimals,
        )} ${symbol}`}
      </p>
      <p>
        {`Total vested: ${formatToken(totalVested || 0, underlyingDealTokenDecimals)} ${symbol}`}
      </p>

      <GradientButton disabled={!address || !isAppConnected || isSubmitting} onClick={claimTokens}>
        Claim tokens
      </GradientButton>
    </>
  )
}

export default genericSuspense(Claim)
