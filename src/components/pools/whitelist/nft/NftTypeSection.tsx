import styled from 'styled-components'

import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import {
  NftType,
  NftWhitelistProcess,
} from '@/src/components/pools/whitelist/nft/NftCollectionsSection'

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 51px;
  max-width: 100%;
  text-align: center;
`

const Wrapper = styled.div`
  display: flex;
  gap: 40px;
  margin: 0 0 40px;
  max-width: fit-content;
`

const getNftWhitelistProcess = (
  nftType: NftType,
): NftWhitelistProcess.unlimited | NftWhitelistProcess.minimumAmount => {
  switch (nftType) {
    case NftType.erc721:
      return NftWhitelistProcess.unlimited
    case NftType.erc1155:
      return NftWhitelistProcess.minimumAmount
  }
}

const NftTypeSection = ({
  active,
  setActive,
  setWhitelistProcess,
}: {
  active: NftType
  setActive: (active: NftType) => void
  setWhitelistProcess: (whitelistProcess: NftWhitelistProcess) => void
}) => {
  return (
    <>
      <Description>Is the NFT collection an ERC-721 or ERC-1155 ?</Description>
      <Wrapper>
        {Object.entries(NftType).map(([key, value]) => (
          <LabeledRadioButton
            checked={active === value}
            key={key}
            label={value}
            onClick={() => {
              setActive(value)
              setWhitelistProcess(getNftWhitelistProcess(value))
            }}
          />
        ))}
      </Wrapper>
    </>
  )
}

export default NftTypeSection
