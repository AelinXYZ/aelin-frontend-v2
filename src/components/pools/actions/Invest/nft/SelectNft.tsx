import styled from 'styled-components'

import { Contents } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { useNftSelection } from '@/src/providers/nftSelectionProvider'

type Props = {
  description: string
}

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
`

const SelectNft: React.FC<Props> = ({ description }) => {
  const { handleOpenNftSelectionModal } = useNftSelection()
  return (
    <>
      <Contents>{description}</Contents>
      <ButtonsWrapper>
        <ButtonGradient onClick={handleOpenNftSelectionModal}>Select NFT</ButtonGradient>
      </ButtonsWrapper>
    </>
  )
}

export default SelectNft
