import Image from 'next/image'
import styled from 'styled-components'

import { VerifiedNftCollection as VerifiedIcon } from '@/src/components/assets/VerifiedNftCollection'
import NftCollectionAttribute, {
  NftCollectionAttributeProps,
} from '@/src/components/pools/whitelist/nft/NftCollectionAttribute'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { ExternalLink } from '@/src/components/table/ExternalLink'

const Card = styled(BaseCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 0;
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: ${({ theme: { nftWhiteList } }) => nftWhiteList.border};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin: 8px 0 12px;
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 1.4;
`

const AttributesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 23px 0 23px;
  gap: 20px;
`

type NftCollectionDetailsProps = {
  imageUrl: string
  name: string
  isVerified: boolean
  url: string
  attributes: NftCollectionAttributeProps[]
}

const NftCollectionDetails = ({
  attributes,
  imageUrl,
  isVerified,
  name,
  url,
}: NftCollectionDetailsProps) => {
  return (
    <Card>
      <Image alt="" height={44} src={imageUrl} width={44} />
      <Row>
        <Title>{name}</Title>
        {isVerified && <VerifiedIcon />}
      </Row>
      <ExternalLink href={url} />
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
    </Card>
  )
}

export default NftCollectionDetails
