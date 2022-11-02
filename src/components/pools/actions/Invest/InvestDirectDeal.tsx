import NftsPickerModal from './nft/NftsPickerModal'
import SelectNft from './nft/SelectNft'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import Approve from '@/src/components/pools/actions/Approve'
import DepositDirectDeal from '@/src/components/pools/actions/Deposit/DepositDirectDeal'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useUserAvailableToDepositDirectDeal } from '@/src/hooks/aelin/useUserAvailableToDepositDirectDeal'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useNftSelection } from '@/src/providers/nftSelectionProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isMerklePool, isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

const Invest: React.FC<Props> = ({ pool, poolHelpers, ...restProps }) => {
  const { address } = useWeb3Connection()
  const { handleCloseNftSelectionModal, hasStoredSelectedNft, showNftSelectionModal } =
    useNftSelection()

  const [userAllowance, refetchUserAllowance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'allowance',
    [address || ZERO_ADDRESS, pool.address],
  )

  const { isUserAllowedToInvest, userAlreadyInvested, userMaxDepositPrivateAmount } =
    useUserAvailableToDepositDirectDeal(pool)

  return (
    <Wrapper title="Deposit tokens" {...restProps}>
      {!userAllowance ? (
        <Contents>There was an error, try again!</Contents>
      ) : poolHelpers.capReached ? (
        <Contents>Max cap reached</Contents>
      ) : !isUserAllowedToInvest ? (
        <Contents>The connected wallet was not allowlisted to invest in this pool.</Contents>
      ) : userAlreadyInvested ? (
        <Contents>This address have already invested in this pool.</Contents>
      ) : userAllowance.gt(ZERO_ADDRESS) ||
        (pool.hasNftList && hasStoredSelectedNft && userAllowance.gt(ZERO_ADDRESS)) ? (
        <DepositDirectDeal pool={pool} poolHelpers={poolHelpers} />
      ) : pool.hasNftList && !hasStoredSelectedNft ? (
        <SelectNft description="Before you deposit, you need to select the NFT(s) you hold in your wallet in order to unlock deposit." />
      ) : (
        <Approve
          allowance={
            isPrivatePool(pool.poolType) || isMerklePool(pool)
              ? userMaxDepositPrivateAmount.formatted
              : undefined
          }
          description={`Before you can deposit, the pool needs your permission to transfer your ${pool.investmentTokenSymbol}`}
          refetchAllowance={refetchUserAllowance}
          spender={pool.address}
          symbol={pool.investmentTokenSymbol}
          title="Deposit tokens"
          tokenAddress={pool.investmentToken}
        />
      )}
      {showNftSelectionModal && (
        <NftsPickerModal onClose={handleCloseNftSelectionModal} pool={pool} />
      )}
    </Wrapper>
  )
}

export default genericSuspense(Invest)
