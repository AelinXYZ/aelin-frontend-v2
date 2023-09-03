import styled from 'styled-components'

import { Contents, Wrapper } from '../pools/actions/Wrapper'
import { ButtonGradient } from '../pureStyledComponents/buttons/Button'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useBurnAelin } from '@/src/providers/burnAelinProvider'

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
`

const SwapAelinToken: React.FC = () => {
  const { setHasSwapped } = useBurnAelin()

  const handleSwapTokens = () => {
    console.log('send tx')
    setHasSwapped(true)
  }

  return (
    <Wrapper title={`Swap Tokens`}>
      <Contents>Call the swap method to burn your AELIN for a share of treasury assets</Contents>
      <ButtonsWrapper>
        <ButtonGradient disabled={false} onClick={handleSwapTokens}>
          Swap
        </ButtonGradient>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default genericSuspense(SwapAelinToken)
