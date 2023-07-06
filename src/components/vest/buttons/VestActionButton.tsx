import styled, { css } from 'styled-components'

import isBefore from 'date-fns/isBefore'
import ms from 'ms'

import { ButtonGradientSm } from '../../pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinAmountToVest from '@/src/hooks/aelin/useAelinAmountToVest'
import { ParsedVestingDeal } from '@/src/hooks/aelin/useAelinVestingDeals'
import useGetVestingTokens from '@/src/hooks/aelin/useGetVestingTokens'
import {
  AelinDealCombined,
  useAelinDealTransaction,
} from '@/src/hooks/contracts/useAelinDealTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isHiddenPool } from '@/src/utils/isHiddenPool'

const ButtonCSS = css`
  min-width: 80px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    min-width: 0;
  }
`

const VestButton = styled(ButtonGradientSm)`
  ${ButtonCSS}
`

const VestActionButton = ({ pool }: { pool: ParsedVestingDeal }) => {
  const { address: userAddress } = useWeb3Connection()

  const { data: vestingTokensData } = useGetVestingTokens({
    chainId: pool.chainId,
    where: {
      dealAddress: pool.upfrontDealAddress ?? pool.dealAddress,
      owner: userAddress,
    },
    config: { refreshInterval: ms('5s') },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken) => Number(vestingToken.tokenId)) ?? []

  const dealMethod = pool.isDealTokenTransferable ? 'claimUnderlyingMultipleEntries' : 'claim'

  const { execute: claim } = useAelinDealTransaction(
    pool.dealAddress ?? ZERO_ADDRESS,
    dealMethod,
    pool.isDealTokenTransferable,
  )

  const [amountToVest, refetchAmountToVest] = useAelinAmountToVest(
    pool.isDealTokenTransferable,
    tokenIds,
    pool.poolAddress,
    pool.chainId,
    true,
  )

  const handleVestTokens = async () => {
    pool.isDealTokenTransferable
      ? await claim([tokenIds] as Parameters<AelinDealCombined['functions'][typeof dealMethod]>)
      : await claim()

    refetchAmountToVest()
  }

  const canVest =
    !isHiddenPool(pool.poolAddress) && pool.lastClaim !== null
      ? isBefore(pool.lastClaim, pool.vestingPeriodEnds)
      : amountToVest.gt(ZERO_BN)

  return (
    <VestButton
      disabled={!canVest}
      onClick={(e) => {
        e.preventDefault()
        handleVestTokens()
      }}
    >
      Vest
    </VestButton>
  )
}

export default VestActionButton
