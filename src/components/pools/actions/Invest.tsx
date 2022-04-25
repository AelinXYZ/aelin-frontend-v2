import styled from 'styled-components'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import Approve from '@/src/components/pools/actions/Approve'
import Deposit from '@/src/components/pools/actions/Deposit'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { Funding } from '@/types/aelinPool'

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 20px;
  text-align: left;
  width: 100%;
`

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

function Invest({ pool, poolHelpers }: Props) {
  return (
    <>
      <Title>Deposit tokens</Title>
      {!poolHelpers.userAllowance ? (
        <>There was an error, try again!</>
      ) : poolHelpers.capReached ? (
        <>Max cap reached</>
      ) : poolHelpers.userAllowance.gt(ZERO_ADDRESS) ? (
        <Deposit pool={pool} poolHelpers={poolHelpers} />
      ) : (
        <Approve pool={pool} refetchAllowance={poolHelpers.refetchAllowance} />
      )}
    </>
  )
}

export default genericSuspense(Invest)
