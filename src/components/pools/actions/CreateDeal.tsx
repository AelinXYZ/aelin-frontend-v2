import Link from 'next/link'

import { Error } from '../../pureStyledComponents/text/Error'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'

type Props = {
  pool: ParsedAelinPool
}

export default function CreateDeal({ pool, ...restProps }: Props) {
  const disableDealButton = pool.amountInPool.raw.eq(ZERO_BN)
  return (
    <Wrapper {...restProps}>
      {pool.dealsCreated <= 1 && (
        <>
          <Contents>
            The sponsor is looking for a deal, if a deal is found, investors will be able to either
            accept or withdraw their funds.
          </Contents>
          {!disableDealButton ? (
            <Link
              href={`/pool/${getKeyChainByValue(pool.chainId)}/${pool.address}/create-deal`}
              passHref
            >
              <GradientButton as="a">Create Deal</GradientButton>
            </Link>
          ) : (
            <GradientButton disabled={disableDealButton}>Create Deal</GradientButton>
          )}
          {disableDealButton && <Error>The pool do not have founds</Error>}
        </>
      )}
      {pool.dealsCreated > 1 && (
        <>
          <Contents>
            The previous deal you hasn't been funded. You can create a new deal now.
            <br />
            Deals attempts: {`${pool.dealsCreated}/5`}
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
