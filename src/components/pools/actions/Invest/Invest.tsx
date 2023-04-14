import NftsPickerModal from './nft/NftsPickerModal'
import SelectNft from './nft/SelectNft'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import Approve from '@/src/components/pools/actions/Approve'
import Deposit from '@/src/components/pools/actions/Deposit/Deposit'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useUserAvailableToDeposit } from '@/src/hooks/aelin/useUserAvailableToDeposit'
import { useNftSelection } from '@/src/providers/nftSelectionProvider'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

const Invest: React.FC<Props> = ({ pool, poolHelpers, ...restProps }) => {
  const { handleCloseNftSelectionModal, hasStoredSelectedNft, showNftSelectionModal } =
    useNftSelection()

  const {
    isUserAllowedToInvest,
    refetchUserAllowance,
    userAllowance,
    userAlreadyInvested,
    userMaxDepositPrivateAmount,
  } = useUserAvailableToDeposit(pool)

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
      ) : userAllowance.raw.gt(ZERO_ADDRESS) ||
        (pool.hasNftList && hasStoredSelectedNft && userAllowance.raw.gt(ZERO_ADDRESS)) ? (
        <Deposit pool={pool} poolHelpers={poolHelpers} />
      ) : pool.hasNftList && !hasStoredSelectedNft ? (
        <SelectNft description="Before you deposit, you need to select the NFT(s) you hold in your wallet in order to unlock deposit." />
      ) : (
        <Approve
          allowance={
            userMaxDepositPrivateAmount.raw.gt(ZERO_BN)
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
