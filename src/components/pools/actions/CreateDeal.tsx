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
  const disableDealButton = pool.amountInPool.raw === ZERO_BN
  return (
    <Wrapper title="Awaiting Deal" {...restProps}>
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
    </Wrapper>
  )
}
