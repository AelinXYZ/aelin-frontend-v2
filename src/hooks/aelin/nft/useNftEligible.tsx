import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import useERC721Call from '../../contracts/useERC721Call'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ParsedNftCollectionRules } from '@/src/utils/aelinPoolUtils'

//Check Eligibility for ERC721
const useNftEligible = (rules?: ParsedNftCollectionRules, tokenId?: string) => {
  const { appChainId } = useWeb3Connection()
  const [eligible, setEligible] = useState<boolean>(false)
  const [isTokenValid] = useERC721Call(
    appChainId,
    rules?.collectionAddress || ZERO_ADDRESS,
    'ownerOf',
    [tokenId ? BigNumber.from(tokenId) : ''],
  )

  useEffect(() => {
    if (rules && tokenId) {
      if (!isTokenValid) {
        setEligible(false)
      } else if (rules.erc721Blacklisted.includes(tokenId)) {
        setEligible(false)
      } else {
        setEligible(true)
      }
    }
  }, [rules, tokenId, isTokenValid])

  return eligible
}

export default useNftEligible
