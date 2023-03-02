import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { debounce } from 'lodash'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Search } from '@/src/components/pureStyledComponents/form/Search'
import { DEBOUNCED_INPUT_TIME } from '@/src/constants/misc'
import useNftEligible from '@/src/hooks/aelin/nft/useNftEligible'
import { ParsedNftCollectionRules } from '@/src/utils/aelinPoolUtils'

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-weight: 600;
  font-size: 0.8rem;
  line-height: 1.4;
`
const SubTitle = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-weight: 400;
  font-size: 0.8rem;
  line-height: 1rem;
  padding-bottom: 1rem;
`

const Eligible = styled.div`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 1rem;
  min-height: 15px;
`

const EligibleError = styled.span`
  color: #ff7777;
`

const Verifying = styled(Eligible)`
  font-style: italic;
`

type NftEligibilityProps = {
  rules: ParsedNftCollectionRules
}

type EligibilityProps = {
  rules: ParsedNftCollectionRules
  tokenId?: string
}

const Eligibility: React.FC<EligibilityProps> = genericSuspense(
  ({ rules, tokenId }) => {
    const eligible = useNftEligible(rules, tokenId)
    return (
      <Eligible>
        {tokenId &&
          tokenId !== '' &&
          (eligible ? (
            <>
              NFT Id <b>{tokenId}</b> is eligible to invest.
            </>
          ) : (
            <EligibleError>
              NFT Id <b>{tokenId}</b> is <b>NOT</b> eligible to invest.
            </EligibleError>
          ))}
      </Eligible>
    )
  },
  () => <Verifying>Verifying token...</Verifying>,
)

const NftEligibility: React.FC<NftEligibilityProps> = ({ rules }) => {
  const [tokenId, setTokenId] = useState<string>()
  const searchRef = useRef<HTMLInputElement>(null)

  const debouncedSetTokenId = useMemo(
    () => debounce(setTokenId, DEBOUNCED_INPUT_TIME),
    [setTokenId],
  )

  return (
    <>
      <Title>Verify NFT ID eligibility</Title>
      <SubTitle> Each ID may only be used once per pool</SubTitle>
      <Search
        onChange={(e) => debouncedSetTokenId(e.target.value)}
        placeholder="Enter NFT ID..."
        ref={searchRef}
        type="number"
      />
      <Eligibility rules={rules} tokenId={tokenId} />
    </>
  )
}

export default NftEligibility
