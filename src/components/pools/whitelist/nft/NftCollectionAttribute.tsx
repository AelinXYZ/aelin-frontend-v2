import styled from 'styled-components'

import NftMedia from '../../actions/Invest/nft/NftMedia'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 8px;
  width: 80px;
  height: 55px;
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: 0.5px solid #ffffff;
  border-radius: ${({ theme: { nftWhiteList } }) => nftWhiteList.borderRadius};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
`

const Value = styled.div`
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textColor};
`

const Name = styled.div`
  font-weight: 400;
  font-size: 0.7rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textColorLight};
`

export type NftCollectionAttributeProps = {
  name: string
  value: string
  currencyImageUrl: string | undefined
}

const NftCollectionAttribute = ({ currencyImageUrl, name, value }: NftCollectionAttributeProps) => {
  return (
    <Card>
      <Row>
        {currencyImageUrl && <NftMedia height={15} src={currencyImageUrl} width={8} />}
        <Value>{value}</Value>
      </Row>
      <Name>{name}</Name>
    </Card>
  )
}

export default NftCollectionAttribute
