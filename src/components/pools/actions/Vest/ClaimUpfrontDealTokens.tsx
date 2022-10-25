import { useMemo } from 'react'
import styled from 'styled-components'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { ChainsValues } from '@/src/constants/chains'
import { BASE_DECIMALS, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
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
  refund?: boolean
  upfrontDeal: ParsedAelinPool['upfrontDeal']
  chainId: ChainsValues
}

type SponsorClaimProps = {
  refund?: boolean
  upfrontDeal: ParsedAelinPool['upfrontDeal']
}

type HolderClaimProps = {
  refund?: boolean
  upfrontDeal: ParsedAelinPool['upfrontDeal']
}

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`

const Title = styled.h3`
  margin: 5px 0;
`

const InnerContainer = styled.div`
  margin-bottom: 20px;
`

const PurchaserClaim = ({ chainId, refund, upfrontDeal }: PurchaserClaimProps) => {
  const { address, isAppConnected } = useWeb3Connection()
  const { estimate, execute: claim } = useAelinPoolUpfrontDealTransaction(
    upfrontDeal?.address || ZERO_ADDRESS,
    'purchaserClaim',
  )
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const [, refetchPoolShares] = useAelinPoolSharesPerUser(
    upfrontDeal?.address || ZERO_ADDRESS,
    upfrontDeal?.underlyingToken.decimals || BASE_DECIMALS,
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
      title: refund ? `Refund Deal Tokens as Purchaser` : `Claim Deal Tokens as Purchaser`,
      estimate: () => estimate([]),
    })
  }

  return (
    <ButtonGradient
      disabled={!address || !isAppConnected || isSubmitting}
      onClick={claimDealTokens}
    >
      {refund ? 'Refund' : 'Settle'}
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
      Settle
    </ButtonGradient>
  )
}

const HolderClaim = ({ refund, upfrontDeal }: HolderClaimProps) => {
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
      title: refund ? `Refund Deal Tokens as Holder` : `Claim Deal Tokens as Holder`,
      estimate: () => estimate([]),
    })
  }

  return (
    <ButtonGradient
      disabled={!address || !isAppConnected || isSubmitting}
      onClick={claimDealTokens}
    >
      {refund ? 'Refund' : 'Claim'}
    </ButtonGradient>
  )
}

function ClaimUpfrontDealTokens({ pool, refund }: Props) {
  const { upfrontDeal } = pool

  const userRoles = useAelinUserRoles(pool)

  const [poolShares] = useAelinPoolSharesPerUser(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    pool.upfrontDeal?.underlyingToken.decimals || BASE_DECIMALS,
    pool.chainId,
    true,
  )

  const sponsorClaim = !!upfrontDeal?.sponsorClaim
  const holderClaim = !!upfrontDeal?.holderClaim

  const hasSponsorFees = pool.sponsorFee.raw.gt(ZERO_BN)

  const content = useMemo(() => {
    if (
      userRoles.includes(UserRole.Visitor) ||
      (!userRoles.includes(UserRole.Investor) &&
        ((userRoles.includes(UserRole.Sponsor) && sponsorClaim) ||
          (userRoles.includes(UserRole.Holder) && holderClaim)))
    ) {
      return <InnerContainer>You have not participated in this pool</InnerContainer>
    }

    const content: JSX.Element[] = []

    if (refund) {
      if (
        (userRoles.includes(UserRole.Investor) && poolShares.raw.gt(ZERO_BN)) ||
        (userRoles.includes(UserRole.Holder) && !holderClaim)
      ) {
        const Component = <></>
        content.push(Component)
      } else {
        const Component = (
          <InnerContainer>
            <span>All your tokens have been refunded</span>
          </InnerContainer>
        )
        content.push(Component)
      }

      if (userRoles.includes(UserRole.Investor) && poolShares.raw.gt(ZERO_BN)) {
        const Component = (
          <InnerContainer>
            <Title>Investor</Title>
            <span>
              Withdraw your <b>invesment tokens</b> since the minimum raise has not been reached
            </span>
            <ButtonsWrapper>
              <PurchaserClaim chainId={pool.chainId} refund upfrontDeal={upfrontDeal} />
            </ButtonsWrapper>
          </InnerContainer>
        )
        content.push(Component)
      }

      if (userRoles.includes(UserRole.Holder) && !holderClaim) {
        const Component = (
          <InnerContainer>
            <Title>Holder</Title>
            <span>
              Withdraw your <b>deal tokens</b> since the minimum raise has not been reached
            </span>
            <ButtonsWrapper>
              <HolderClaim refund upfrontDeal={upfrontDeal} />
            </ButtonsWrapper>
          </InnerContainer>
        )
        content.push(Component)
      }
    } else {
      if (userRoles.includes(UserRole.Investor) && poolShares.raw.gt(ZERO_BN)) {
        const Component = (
          <InnerContainer>
            <Title>Investor</Title>
            <span>Begin the vesting period for your deal tokens</span>
            <ButtonsWrapper>
              <PurchaserClaim chainId={pool.chainId} upfrontDeal={upfrontDeal} />
            </ButtonsWrapper>
          </InnerContainer>
        )

        content.push(Component)
      }

      if (userRoles.includes(UserRole.Sponsor) && !sponsorClaim && hasSponsorFees) {
        const Component = (
          <InnerContainer>
            <Title>Sponsor</Title>
            <span>Collect the sponsor fee from the pool</span>
            <ButtonsWrapper>
              <SponsorClaim upfrontDeal={upfrontDeal} />
            </ButtonsWrapper>
          </InnerContainer>
        )

        content.push(Component)
      }

      if (userRoles.includes(UserRole.Holder) && !holderClaim) {
        const Component = (
          <InnerContainer>
            <Title>Holder</Title>
            <span>Claim the investment tokens from the pool</span>
            <ButtonsWrapper>
              <HolderClaim upfrontDeal={upfrontDeal} />
            </ButtonsWrapper>
          </InnerContainer>
        )

        content.push(Component)
      }
    }

    if (!content.length) return <span>You've settled all your tokens.</span>

    return content.map((content) => <>{content}</>)
  }, [
    userRoles,
    pool.chainId,
    refund,
    poolShares.raw,
    holderClaim,
    sponsorClaim,
    hasSponsorFees,
    upfrontDeal,
  ])

  return (
    <Wrapper title={refund ? 'Refund tokens' : 'Settle Allocation'}>
      <Contents>{content}</Contents>
    </Wrapper>
  )
}

export default genericSuspense(ClaimUpfrontDealTokens)
