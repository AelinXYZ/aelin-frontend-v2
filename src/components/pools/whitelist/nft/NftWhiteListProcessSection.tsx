import styled, { css } from 'styled-components'

import {
  NftType,
  NftWhitelistProcess,
} from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'

const Wrapper = styled.div`
  column-gap: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 19px 0 20px;
  row-gap: 10px;
`

const Description = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 40px;
  max-width: 100%;
  text-align: center;
`

const ActiveItemCSS = css`
  &,
  &:hover {
    background-color: rgba(130, 128, 255, 0.08);
    border-color: ${({ theme: { colors } }) => colors.primary};
    color: ${({ theme: { colors } }) => colors.primary};
    cursor: default;
    pointer-events: none;
  }
`

const Item = styled(ButtonPrimaryLight)<{ isActive?: boolean }>`
  width: 140px;
  height: 30px;
  font-size: 1.2rem;

  ${({ isActive }) => isActive && ActiveItemCSS}
`

const getItems = (nftType: NftType): [string, NftWhitelistProcess][] => {
  const entries = Object.entries(NftWhitelistProcess)
  switch (nftType) {
    case NftType.erc721:
      return entries.splice(0, 3)
    case NftType.erc1155:
      return entries.splice(3, entries.length - 3)
  }
}

const getDescription = (active: NftWhitelistProcess): string => {
  switch (active) {
    case NftWhitelistProcess.unlimited:
      return 'Each wallet holding a qualified NFT can deposit an unlimited amount of Investment tokens.'
    case NftWhitelistProcess.limitedPerWallet:
      return 'Each wallet holding qualified NFTs can deposit a limited amount of Investment tokens, regardless of the number of qualified NFTs held.'
    case NftWhitelistProcess.limitedPerNft:
      return 'Each wallet holding qualified NFTs can deposit a limited amount of Investment tokens, regarding of the number of qualified NFTs held.'
    case NftWhitelistProcess.minimumAmount:
      return 'Each wallet holding a qualified ERC-1155 can deposit a minimum amount of Investment tokens.'
  }
}

const NftWhiteListProcessSection = ({
  active,
  nftType,
  setActive,
}: {
  nftType: NftType
  active: NftWhitelistProcess
  setActive: (active: NftWhitelistProcess) => void
}) => {
  return (
    <>
      <Wrapper>
        {getItems(nftType).map(([key, value]) => (
          <Item isActive={active === value} key={key} onClick={() => setActive(value)}>
            {value}
          </Item>
        ))}
      </Wrapper>
      <Description>{getDescription(active)}</Description>
    </>
  )
}

export default NftWhiteListProcessSection
