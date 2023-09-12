import Link from 'next/link'

import { Contents, Wrapper } from '../pools/actions/Wrapper'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useBurnAelin } from '@/src/providers/burnAelinProvider'

const SwapAelinToken: React.FC = () => {
  const { swapTransactionHash } = useBurnAelin()
  return (
    <Wrapper title={`Tokens swapped!`}>
      <Contents>
        You have successfully swapped all your AELIN tokens.
        <br /> For more information you can check the{' '}
        <Link href={`https://optimistic.etherscan.io/tx/${swapTransactionHash}`} target="_blank">
          transaction receipt.
        </Link>
      </Contents>
    </Wrapper>
  )
}

export default genericSuspense(SwapAelinToken)
