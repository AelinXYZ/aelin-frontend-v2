import styled from 'styled-components'

import NftMedia from '../../actions/Invest/nft/NftMedia'
import { VerifiedNftCollection as VerifiedIcon } from '@/src/components/assets/VerifiedNftCollection'
import NftCollectionAttribute, {
  NftCollectionAttributeProps,
} from '@/src/components/pools/whitelist/nft/NftCollectionAttribute'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { DATE_FORMAT_SIMPLE, formatDate } from '@/src/utils/date'

const Card = styled(BaseCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 0;
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: 1px solid ${({ theme: { nftWhiteList } }) => nftWhiteList.border};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.4;
`

const AttributesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 23px 10px;
  gap: 10px;

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    flex-wrap: wrap;
    width: 50%;
  }
`
const Small = styled.small`
  margin: 5px;
`

type NftCollectionDetailsProps = {
  name: string
  attributes: NftCollectionAttributeProps[]
  imageUrl?: string
  isVerified?: boolean
  updatedAt?: string
}

const NftCollectionDetails = ({
  attributes,
  imageUrl,
  isVerified,
  name,
  updatedAt,
}: NftCollectionDetailsProps) => {
  return (
    <Card>
      <NftMedia height={44} src={imageUrl} width={44} />
      <Row>
        <Title>{name}</Title>
        {isVerified && <VerifiedIcon />}
      </Row>
      {!!attributes.length && (
        <AttributesWrapper>
          {attributes.map(({ currencyImageUrl, name, value }) => (
            <NftCollectionAttribute
              currencyImageUrl={currencyImageUrl}
              key={name}
              name={name}
              value={value}
            />
          ))}
        </AttributesWrapper>
      )}
      {updatedAt && (
        <Small>Data Updated At {formatDate(new Date(updatedAt), DATE_FORMAT_SIMPLE)}</Small>
      )}
    </Card>
  )
}

export default NftCollectionDetails
