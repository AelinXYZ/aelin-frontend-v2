import styled from 'styled-components'

import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
}

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
`

const SponsorClaimButton = ({ pool }: Props) => {
  const { address, isAppConnected } = useWeb3Connection()

  const method = 'sponsorClaim'

  const { estimate, execute: claim } = useAelinPoolTransaction(
    pool?.address || ZERO_ADDRESS,
    method,
  )

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const claimDealTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await claim([], txGasOptions)
      },
      title: `Claim sponsor fee`,
      estimate: () => estimate([]),
    })
  }

  return (
    <ButtonGradient
      disabled={!address || !isAppConnected || isSubmitting}
      onClick={claimDealTokens}
    >
      Claim
    </ButtonGradient>
  )
}

function SponsorClaim({ pool }: Props) {
  return (
    <Wrapper title={'Claim sponsor fee'}>
      <Contents>Claim the sponsor fee from the pool</Contents>
      <br />
      <Contents>
        <ButtonsWrapper>
          <SponsorClaimButton pool={pool} />
        </ButtonsWrapper>
      </Contents>
    </Wrapper>
  )
}

export default SponsorClaim
