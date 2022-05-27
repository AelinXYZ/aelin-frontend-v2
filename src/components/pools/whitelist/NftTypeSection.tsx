import styled from 'styled-components'

import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'

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

export enum NftType {
  erc721 = 'ERC-721*',
  erc1155 = 'ERC-1155',
}

const NftTypeSection = ({
  active,
  setActive,
}: {
  active: NftType
  setActive: (nftType: NftType) => void
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
            }}
          />
        ))}
      </Wrapper>
    </>
  )
}

export default NftTypeSection
