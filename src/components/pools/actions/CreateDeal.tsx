import Link from 'next/link'
import styled from 'styled-components'

import { Error as BaseError } from '../../pureStyledComponents/text/Error'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'

const Error = styled(BaseError)`
  margin: 0;
`

type Props = {
  pool: ParsedAelinPool
}

export default function CreateDeal({ pool, ...restProps }: Props) {
  const noFundsInPool = pool.amountInPool.raw.eq(ZERO_BN)

  return (
    <Wrapper title={noFundsInPool ? 'No funds in pool' : 'Awaiting Deal'} {...restProps}>
      {noFundsInPool ? (
        <Error>
          Funds are needed to create a deal.
          <br />
          <br />
          The investment window has expired and as such it's not possible to add funds.
        </Error>
      ) : (
        <>
          <Contents>
            The sponsor is looking for a deal, if a deal is found, investors will be able to either
            accept or withdraw their funds.
          </Contents>
          <Link
            href={`/pool/${getKeyChainByValue(pool.chainId)}/${pool.address}/create-deal`}
            passHref
          >
            <GradientButton as="a">Create Deal</GradientButton>
          </Link>
        </>
      )}
    </Wrapper>
  )
}
