import Link from 'next/link'

import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'

type Props = {
  pool: ParsedAelinPool
}

export default function CreateDeal({ pool, ...restProps }: Props) {
  return (
    <Wrapper {...restProps}>
      {pool.dealsCreated <= 1 && (
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
