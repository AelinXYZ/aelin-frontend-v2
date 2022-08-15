import { Contents } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { useNftSelection } from '@/src/providers/nftSelectionProvider'

type Props = {
  description: string
}

const SelectNft: React.FC<Props> = ({ description }) => {
  const { handleOpenNftSelectionModal } = useNftSelection()
  return (
    <>
      <Contents>{description}</Contents>
      <ButtonGradient onClick={handleOpenNftSelectionModal}>Select NFT</ButtonGradient>
    </>
  )
}

export default SelectNft
