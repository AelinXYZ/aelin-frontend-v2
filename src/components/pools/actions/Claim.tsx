import { Contents } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinDealTransaction } from '@/src/hooks/contracts/useAelinDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

type Props = {
  pool: ParsedAelinPool
}

export default function Claim({ pool }: Props) {
  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const { estimate, execute: claim } = useAelinDealTransaction(
    pool.dealAddress || ZERO_ADDRESS,
    'claim',
  )
  const { data, mutate: refetch } = useVestingDealById({
    id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.dealAddress}`,
  })

  const claimTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await claim([], txGasOptions)
        if (receipt) {
          refetch()
        }
      },
      title: `Claim ${data?.vestingDeal?.tokenToVestSymbol}`,
      estimate: () => estimate([]),
    })
  }

  const { remainingAmountToVest, totalVested } = data?.vestingDeal || {}
  const symbol = pool.deal?.underlyingToken.symbol
  return (
    <>
      <Contents>Your deal tokens can be claimed.</Contents>
      <p>
        Amount to claim:
        {`${remainingAmountToVest || '0'} ${symbol}`}
      </p>
      <p>
        Total vested:
        {`${totalVested || '0'} ${symbol}`}
      </p>

      <GradientButton disabled={!address || !isAppConnected || isSubmitting} onClick={claimTokens}>
        Claim tokens
      </GradientButton>
    </>
  )
}
