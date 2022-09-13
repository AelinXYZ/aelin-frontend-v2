import { useMemo } from 'react'
import styled from 'styled-components'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolSharesPerUser from '@/src/hooks/aelin/useAelinPoolSharesPerUser'
import useAelinUserRoles from '@/src/hooks/aelin/useAelinUserRoles'
import { useAelinPoolUpfrontDealTransaction } from '@/src/hooks/contracts/useAelinPoolUpfrontDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { UserRole } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  refund?: boolean
}

type PurchaserClaimProps = {
  upfrontDeal: ParsedAelinPool['upfrontDeal']
  chainId: ChainsValues
}

type SponsorClaimProps = {
  upfrontDeal: ParsedAelinPool['upfrontDeal']
}

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 35px;
`

const PurchaserClaim = ({ chainId, upfrontDeal }: PurchaserClaimProps) => {
  const { address, isAppConnected } = useWeb3Connection()
  const { estimate, execute: claim } = useAelinPoolUpfrontDealTransaction(
    upfrontDeal?.address || ZERO_ADDRESS,
    'purchaserClaim',
  )
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const [poolShares, refetchPoolShares] = useAelinPoolSharesPerUser(
    upfrontDeal?.address || ZERO_ADDRESS,
    upfrontDeal?.underlyingToken.decimals || 18,
    chainId,
    false,
  )

  const claimDealTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await claim([], txGasOptions)
        if (receipt) {
          refetchPoolShares()
        }
      },
      title: `Claim Deal Tokens as Purchaser`,
      estimate: () => estimate([]),
    })
  }

  return (
    <ButtonGradient
      disabled={!address || !isAppConnected || isSubmitting}
      onClick={claimDealTokens}
    >
      Claim as Purchaser
    </ButtonGradient>
  )
}

const SponsorClaim = ({ upfrontDeal }: SponsorClaimProps) => {
  const { address, isAppConnected } = useWeb3Connection()
  const { estimate, execute: claim } = useAelinPoolUpfrontDealTransaction(
    upfrontDeal?.address || ZERO_ADDRESS,
    'sponsorClaim',
  )
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const claimDealTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await claim([], txGasOptions)
      },
      title: `Claim Deal Tokens as Sponsor`,
      estimate: () => estimate([]),
    })
  }

  return (
    <ButtonGradient
      disabled={!address || !isAppConnected || isSubmitting}
      onClick={claimDealTokens}
    >
      Claim as Sponsor
    </ButtonGradient>
  )
}

const HolderClaim = ({ upfrontDeal }: SponsorClaimProps) => {
  const { address, isAppConnected } = useWeb3Connection()
  const { estimate, execute: claim } = useAelinPoolUpfrontDealTransaction(
    upfrontDeal?.address || ZERO_ADDRESS,
    'holderClaim',
  )
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const claimDealTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await claim([], txGasOptions)
      },
      title: `Claim Deal Tokens as Holder`,
      estimate: () => estimate([]),
    })
  }

  return (
    <ButtonGradient
      disabled={!address || !isAppConnected || isSubmitting}
      onClick={claimDealTokens}
    >
      Claim as Holder
    </ButtonGradient>
  )
}

function ClaimUpfrontDealTokens({ pool, refund }: Props) {
  const { upfrontDeal } = pool

  const userRoles = useAelinUserRoles(pool)

  const sponsorClaim = !!upfrontDeal?.sponsorClaim
  const holderClaim = !!upfrontDeal?.holderClaim
  const hasSponsorFees = !!pool.sponsorFee.raw.gt(ZERO_BN)

  const content = useMemo(() => {
    const content: string[] = []
    if (refund) {
      content.push('Some text saying that the raise did not pass so tokens will be refunded')

      if (userRoles.includes(UserRole.Investor)) {
        content.push('Some text saying you can get your purchase tokens used as Purchaser')
      }

      if (userRoles.includes(UserRole.Holder)) {
        content.push('Some text saying you can get your deal tokens deposited as Holder')
      }
    } else {
      if (userRoles.includes(UserRole.Investor)) {
        content.push('Some text saying you can get your accepted deal tokens')
      }

      if (userRoles.includes(UserRole.Sponsor)) {
        content.push('Some text saying you can get your fees in deal tokens')
      }

      if (userRoles.includes(UserRole.Holder)) {
        content.push('Some text saying you can get your raise in purchase tokens')
      }
    }

    return content.map((c) => (
      <>
        {c}
        <br />
      </>
    ))
  }, [refund, userRoles])

  return (
    <Wrapper title={refund ? 'Refund tokens' : 'Claim deal tokens'}>
      <Contents style={{ marginBottom: '18px' }}>{content}</Contents>
      <ButtonsWrapper>
        {userRoles.includes(UserRole.Investor) && (
          <PurchaserClaim chainId={pool.chainId} upfrontDeal={upfrontDeal} />
        )}
        {userRoles.includes(UserRole.Sponsor) && hasSponsorFees && !sponsorClaim && !refund && (
          <SponsorClaim upfrontDeal={upfrontDeal} />
        )}
        {userRoles.includes(UserRole.Holder) && !holderClaim && (
          <HolderClaim upfrontDeal={upfrontDeal} />
        )}
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default genericSuspense(ClaimUpfrontDealTokens)
