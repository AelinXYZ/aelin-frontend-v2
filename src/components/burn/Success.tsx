import Link from 'next/link'

import { Contents, Wrapper } from '../pools/actions/Wrapper'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'

const SwapAelinToken: React.FC = () => {
  return (
    <Wrapper title={`Tokens swapped!`}>
      <Contents>
        You have successfully swapped all your AELIN tokens.
        <br /> For more information you can check the{' '}
        <Link href="https://optimistic.etherscan.io/tx/some-txs" target="_blank">
          transaction receipt.
        </Link>
      </Contents>
    </Wrapper>
  )
}

export default genericSuspense(SwapAelinToken)
