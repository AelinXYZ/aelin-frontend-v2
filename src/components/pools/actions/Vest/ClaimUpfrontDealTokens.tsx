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
import {
  AelinUpfrontDealCombined,
  useAelinUpfrontDealTransaction,
} from '@/src/hooks/contracts/useAelinUpfrontDealTransaction'
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
  isDealTokenTransferable: boolean
}

type SponsorClaimProps = {
  refund?: boolean
  upfrontDeal: ParsedAelinPool['upfrontDeal']
  isDealTokenTransferable: boolean
}

type HolderClaimProps = {
  refund?: boolean
  upfrontDeal: ParsedAelinPool['upfrontDeal']
  isDealTokenTransferable: boolean
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

const PurchaserClaim = ({
  chainId,
  isDealTokenTransferable,
  refund,
  upfrontDeal,
}: PurchaserClaimProps) => {
  const { address, isAppConnected } = useWeb3Connection()

  const method = 'purchaserClaim'

  const { estimate, execute: claim } = useAelinUpfrontDealTransaction(
    upfrontDeal?.address || ZERO_ADDRESS,
    method,
    isDealTokenTransferable,
  )
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const [, refetchPoolShares] = useAelinPoolSharesPerUser(
    upfrontDeal?.address || ZERO_ADDRESS,
    upfrontDeal?.underlyingToken.decimals || BASE_DECIMALS,
    chainId,
    false,
    isDealTokenTransferable,
  )

  const claimDealTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await claim(
          [] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
          txGasOptions,
        )
        if (receipt) {
          refetchPoolShares()
        }
      },
      title: refund ? `Refund Deal Tokens as Purchaser` : `Settle Deal Tokens as Purchaser`,
      estimate: () =>
        estimate([] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>),
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

const SponsorClaim = ({ isDealTokenTransferable, upfrontDeal }: SponsorClaimProps) => {
  const { address, isAppConnected } = useWeb3Connection()

  const method = 'sponsorClaim'

  const { estimate, execute: claim } = useAelinUpfrontDealTransaction(
    upfrontDeal?.address || ZERO_ADDRESS,
    method,
    isDealTokenTransferable,
  )

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const claimDealTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await claim(
          [] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
          txGasOptions,
        )
      },
      title: `Settle Deal Tokens as Sponsor`,
      estimate: () =>
        estimate([] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>),
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

const HolderClaim = ({ isDealTokenTransferable, refund, upfrontDeal }: HolderClaimProps) => {
  const { address, isAppConnected } = useWeb3Connection()

  const method = 'holderClaim'

  const { estimate, execute: claim } = useAelinUpfrontDealTransaction(
    upfrontDeal?.address || ZERO_ADDRESS,
    method,
    isDealTokenTransferable,
  )
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const claimDealTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await claim(
          [] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
          txGasOptions,
        )
      },
      title: refund ? `Refund Deal Tokens as Holder` : `Claim Deal Tokens as Holder`,
      estimate: () =>
        estimate([] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>),
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
  const { isDealTokenTransferable, upfrontDeal } = pool

  const userRoles = useAelinUserRoles(pool)

  const [poolShares] = useAelinPoolSharesPerUser(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    pool.upfrontDeal?.underlyingToken.decimals || BASE_DECIMALS,
    pool.chainId,
    true,
    isDealTokenTransferable,
  )

  const sponsorClaim = !!upfrontDeal?.sponsorClaim
  const holderClaim = !!upfrontDeal?.holderClaim

  const hasSponsorFees = pool.sponsorFee.raw.gt(ZERO_BN)

  const didNotParticipated = userRoles.includes(UserRole.Visitor)

  const content = useMemo(() => {
    if (didNotParticipated) {
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
              <PurchaserClaim
                chainId={pool.chainId}
                isDealTokenTransferable={isDealTokenTransferable}
                refund
                upfrontDeal={upfrontDeal}
              />
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
              <HolderClaim
                isDealTokenTransferable={isDealTokenTransferable}
                refund
                upfrontDeal={upfrontDeal}
              />
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
              <PurchaserClaim
                chainId={pool.chainId}
                isDealTokenTransferable={isDealTokenTransferable}
                upfrontDeal={upfrontDeal}
              />
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
              <SponsorClaim
                isDealTokenTransferable={isDealTokenTransferable}
                upfrontDeal={upfrontDeal}
              />
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
              <HolderClaim
                isDealTokenTransferable={isDealTokenTransferable}
                upfrontDeal={upfrontDeal}
              />
            </ButtonsWrapper>
          </InnerContainer>
        )

        content.push(Component)
      }
    }

    if (!content.length) return <span>You've settled all your tokens.</span>

    return content.map((content) => <>{content}</>)
  }, [
    didNotParticipated,
    refund,
    userRoles,
    poolShares.raw,
    holderClaim,
    pool.chainId,
    isDealTokenTransferable,
    upfrontDeal,
    sponsorClaim,
    hasSponsorFees,
  ])

  const title = didNotParticipated
    ? 'Settle Allocation'
    : refund
    ? 'Refund tokens'
    : 'Settle Allocation'

  return (
    <Wrapper title={title}>
      <Contents>{content}</Contents>
    </Wrapper>
  )
}

export default genericSuspense(ClaimUpfrontDealTokens)
