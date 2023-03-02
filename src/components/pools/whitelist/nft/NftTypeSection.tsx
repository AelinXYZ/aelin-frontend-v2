import styled from 'styled-components'

import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 51px;
  max-width: 100%;
  text-align: center;
`

const Wrapper = styled.div`
  display: flex;
  gap: 40px;
  margin: 0;
  max-width: fit-content;
`

type NftTypeSectionProps = {
  active: NftType
  onChange: (value: NftType) => void
}

const NftTypeSection = ({ active, onChange }: NftTypeSectionProps) => {
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
              onChange(value)
            }}
          />
        ))}
      </Wrapper>
    </>
  )
}

export default NftTypeSection
