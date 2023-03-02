import styled from 'styled-components'

import NftCollectionRulesCarousel from './NftCollectionRulesCarousel'
import OwnedNftsCarousel from './OwnedNftsCarousel'
import {
  Modal as BaseModal,
  Card as ModalCard,
  Title as ModalTitle,
} from '@/src/components/common/Modal'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'

const Description = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  height: 41px;
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 10px 0;
`

const Modal = styled(BaseModal)`
  & ${ModalCard} {
    padding: 20px 25px 0 25px;
  }

  & ${ModalTitle} {
    margin: 0 0 10px;
  }
`

export type NftsPickerModalProps = {
  onClose: () => void
  pool: ParsedAelinPool
}

const NftsPickerModal: React.FC<NftsPickerModalProps> = ({ onClose, pool }) => {
  return (
    <Modal onClose={onClose} showCancelButton={false} size="1040px" title="Select NFT(s)">
      <Description>
        Select and Verify that the NFT's are eligible for the pool. You can also use this tool to
        verify if an NFT for sale is eligible for the pool.
      </Description>
      <NftCollectionRulesCarousel pool={pool} />
      <OwnedNftsCarousel onClose={onClose} pool={pool} />
    </Modal>
  )
}

export default NftsPickerModal
