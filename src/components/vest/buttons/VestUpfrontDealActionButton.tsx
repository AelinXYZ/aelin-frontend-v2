import styled, { css } from 'styled-components'

import isBefore from 'date-fns/isBefore'
import ms from 'ms'

import { ButtonGradientSm } from '../../pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinAmountToVestUpfrontDeal from '@/src/hooks/aelin/useAelinAmountToVestUpfrontDeal'
import { ParsedVestingDeal } from '@/src/hooks/aelin/useAelinVestingDeals'
import useGetVestingTokens from '@/src/hooks/aelin/useGetVestingTokens'
import {
  AelinUpfrontDealCombined,
  useAelinUpfrontDealTransaction,
} from '@/src/hooks/contracts/useAelinUpfrontDealTransaction'
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

const VestUpfrontDealActionButton = ({ pool }: { pool: ParsedVestingDeal }) => {
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

  const upfrontDealMethod = pool.isDealTokenTransferable
    ? 'claimUnderlyingMultipleEntries'
    : 'claimUnderlying'

  const { execute: upfrontDealClaim } = useAelinUpfrontDealTransaction(
    pool.upfrontDealAddress ?? ZERO_ADDRESS,
    upfrontDealMethod,
    pool.isDealTokenTransferable,
  )

  const [amountToVest, refetchAmountToVest] = useAelinAmountToVestUpfrontDeal(
    pool.isDealTokenTransferable,
    tokenIds,
    pool.poolAddress,
    pool.chainId,
    true,
  )

  const handleVestTokens = async () => {
    pool.isDealTokenTransferable
      ? await upfrontDealClaim([tokenIds] as Parameters<
          AelinUpfrontDealCombined['functions'][typeof upfrontDealMethod]
        >)
      : await upfrontDealClaim()

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

export default VestUpfrontDealActionButton
