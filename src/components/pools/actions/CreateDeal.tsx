import Link from 'next/link'

import { Contents } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'

type Props = {
  pool: ParsedAelinPool
}

export default function CreateDeal({ pool }: Props) {
  return (
    <>
      <>Create Deal</>
      <Contents>
        The sponsor is looking for a deal, if a deal is found, investors will be able to either
        accept or withdraw their funds.
      </Contents>
      <Link href={`/pool/${getKeyChainByValue(pool.chainId)}/${pool.address}/createDeal`} passHref>
        <GradientButton as="a">Create Deal</GradientButton>
      </Link>
    </>
  )
}
