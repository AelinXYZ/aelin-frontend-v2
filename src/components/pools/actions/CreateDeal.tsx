import Link from 'next/link'
import styled from 'styled-components'

import { LinkWrapper } from '../common/Create'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'

const TextColor = styled.span`
  color: ${(props) => props.theme.colors.textColor};
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
`

type Props = {
  pool: ParsedAelinPool
}

export const CreateDeal: React.FC<Props> = ({ pool, ...restProps }) => {
  const noFundsInPool = pool.amountInPool.raw.eq(ZERO_BN)

  return (
    <Wrapper title={noFundsInPool ? 'No funds in pool' : ''} {...restProps}>
      {noFundsInPool ? (
        <>
          <Contents>
            <TextColor>
              <b>You can't create a deal.</b>
            </TextColor>{' '}
            A funded pool is needed to create a deal, and this pool has no funds.
          </Contents>
        </>
      ) : pool.dealsCreated <= 1 ? (
        <Contents>
          The sponsor is looking for a deal. If a deal is found, investors will be able to either
          accept or withdraw their funds.
        </Contents>
      ) : (
        <>
          <Contents>
            The previous deal you created hasn't been funded. You can create a new deal now.
          </Contents>
          <Contents>
            Deal creation attempts: <TextColor>{`${pool.dealsCreated} / 5`}</TextColor>
          </Contents>
        </>
      )}
      {noFundsInPool ? null : (
        <LinkWrapper>
          <Link
            href={`/pool/${getKeyChainByValue(pool.chainId)}/${pool.address}/create-deal`}
            passHref
          >
            <ButtonsWrapper>
              <ButtonGradient>Create Deal</ButtonGradient>
            </ButtonsWrapper>
          </Link>
        </LinkWrapper>
      )}
    </Wrapper>
  )
}

export default CreateDeal
