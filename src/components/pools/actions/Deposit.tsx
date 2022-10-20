import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { TextPrimary } from '../../pureStyledComponents/text/Text'
import { TokenInput } from '@/src/components/form/TokenInput'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { BASE_DECIMALS, ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinUserMerkleTreeData, {
  UserMerkleData,
} from '@/src/hooks/aelin/merkle-tree/useAelinUserMerkleTreeData'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useNftUserAllocation from '@/src/hooks/aelin/useNftUserAllocation'
import { AmountTypes, useUserAvailableToDeposit } from '@/src/hooks/aelin/useUserAvailableToDeposit'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { useAelinPoolUpfrontDealTransaction } from '@/src/hooks/contracts/useAelinPoolUpfrontDealTransaction'
import { useNftSelection } from '@/src/providers/nftSelectionProvider'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { formatToken } from '@/src/web3/bigNumber'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

const StyledTokenInput = styled(TokenInput)<{ isPrivate?: boolean }>`
  margin-bottom: ${(props) => (props.isPrivate ? '0px' : '40px')};
`

export const Contents = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 15px 0 30px 0;
  text-align: left;
  text-decoration: none;
  width: 100%;
`

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 5px;
`

const Button = styled(ButtonGradient)`
  width: 110px;
`

const Allowance = ({ allowance }: { allowance: string }) => (
  <Contents>
    Allowance: <TextPrimary>{allowance}</TextPrimary>
  </Contents>
)

function Deposit({ pool, poolHelpers }: Props) {
  const {
    clearStoredSelectedNfts,
    handleOpenNftSelectionModal,
    hasStoredSelectedNft,
    storedSelectedNfts,
  } = useNftSelection()
  const { investmentTokenDecimals, investmentTokenSymbol } = pool
  const allocation = useNftUserAllocation(pool)
  const { investmentTokenBalance, refetchBalances, userMaxDepositPrivateAmount } =
    useUserAvailableToDeposit(pool)
  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const { address, isAppConnected } = useWeb3Connection()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate: purchasePoolTokensEstimate, execute: purchasePoolTokens } =
    useAelinPoolTransaction(pool.address, 'purchasePoolTokens')

  const { estimate: purchasePoolTokensWithNftEstimate, execute: purchasePoolTokensWithNft } =
    useAelinPoolTransaction(pool.address, 'purchasePoolTokensWithNft')

  const { estimate: acceptDealEstimate, execute: acceptDeal } = useAelinPoolUpfrontDealTransaction(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    'acceptDeal',
  )

  const userMerkle = useAelinUserMerkleTreeData(pool)
  const userMerkleData = userMerkle?.data || ({} as UserMerkleData)

  const balances = [
    investmentTokenBalance,
    { ...poolHelpers.maxDepositAllowed, type: AmountTypes.maxDepositAllowed },
  ]

  const sortedBalances = !isPrivatePool(pool.poolType)
    ? balances.sort((a, b) => (a.raw.lt(b.raw) ? -1 : 1))
    : balances.concat(userMaxDepositPrivateAmount).sort((a, b) => (a.raw.lt(b.raw) ? -1 : 1))

  useEffect(() => {
    if (!investmentTokenBalance.raw) {
      setInputError('There was an error calculating User balance')
      return
    }

    const nftAllocationExceeded =
      pool.hasNftList &&
      tokenInputValue &&
      allocation &&
      !allocation.unlimited &&
      BigNumber.from(tokenInputValue).gt(allocation.raw)

    const isInputError =
      (tokenInputValue && BigNumber.from(tokenInputValue).gt(sortedBalances[0].raw)) ||
      nftAllocationExceeded

    if (!isInputError) {
      setInputError('')
    } else {
      sortedBalances[0].type === AmountTypes.maxDepositAllowedPrivate
        ? setInputError(`Max allowed to invest is ${sortedBalances[0].formatted}`)
        : sortedBalances[0].type === AmountTypes.maxDepositAllowed
        ? setInputError(`Max cap allowance ${sortedBalances[0].formatted}`)
        : nftAllocationExceeded
        ? setInputError(`Purchase amount should be less the max allocation`)
        : setInputError(`Insufficient balance`)
    }
  }, [investmentTokenBalance.raw, sortedBalances, tokenInputValue, allocation, pool.hasNftList])

  const depositTokens = async () => {
    if (inputError) {
      return
    }

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = pool.upfrontDeal
          ? await acceptDeal([storedSelectedNfts, userMerkleData, tokenInputValue], txGasOptions)
          : pool.hasNftList
          ? await purchasePoolTokensWithNft([storedSelectedNfts, tokenInputValue], txGasOptions)
          : await purchasePoolTokens([tokenInputValue], txGasOptions)
        if (receipt) {
          refetchBalances()
          setTokenInputValue('')
          setInputError('')
        }
        if (pool.hasNftList) {
          clearStoredSelectedNfts()
        }
      },
      title: `Deposit ${investmentTokenSymbol}`,
      estimate: () =>
        pool.upfrontDeal
          ? acceptDealEstimate([storedSelectedNfts, userMerkleData, tokenInputValue])
          : pool.hasNftList
          ? purchasePoolTokensWithNftEstimate([storedSelectedNfts, tokenInputValue])
          : purchasePoolTokensEstimate([tokenInputValue]),
    })
  }

  const maxValue = useMemo(() => {
    if (pool.hasNftList && allocation && !allocation.unlimited) {
      return allocation.raw.toString()
    }
    return sortedBalances[0].raw.toString()
  }, [pool.hasNftList, allocation, sortedBalances])

  const maxAllocationFormatted = useMemo(() => {
    if (pool.hasNftList && allocation) {
      return allocation.unlimited
        ? 'Unlimited per NFT'
        : `${formatToken(
            allocation.raw,
            BASE_DECIMALS,
            investmentTokenDecimals,
          )} ${investmentTokenSymbol}`
    }
  }, [pool.hasNftList, allocation, investmentTokenSymbol, investmentTokenDecimals])

  return (
    <>
      {!!pool?.upfrontDeal && (
        <Contents>
          By clicking "accept deal" you are agreeing to the negotiated exchange rate. <br />
          If there is excess interest in the pool, all investors will be deallocated proportionally
        </Contents>
      )}
      <StyledTokenInput
        decimals={investmentTokenDecimals}
        error={inputError}
        isPrivate={isPrivatePool(pool.poolType)}
        maxAllocationFormatted={maxAllocationFormatted}
        maxValue={maxValue}
        maxValueFormatted={investmentTokenBalance.formatted || '0'}
        setValue={setTokenInputValue}
        symbol={investmentTokenSymbol}
        value={tokenInputValue}
      />
      {isPrivatePool(pool.poolType) && !!userMaxDepositPrivateAmount?.formatted && (
        <Allowance
          allowance={`${userMaxDepositPrivateAmount.formatted} ${pool.investmentTokenSymbol}`}
        />
      )}
      <ButtonsWrapper>
        <Button
          disabled={
            !address ||
            !isAppConnected ||
            poolHelpers.capReached ||
            isSubmitting ||
            !tokenInputValue ||
            Boolean(inputError) ||
            (pool.hasNftList && !hasStoredSelectedNft)
          }
          onClick={depositTokens}
        >
          {pool?.upfrontDeal ? 'Accept Deal' : 'Deposit'}
        </Button>
        {pool.hasNftList && <Button onClick={handleOpenNftSelectionModal}>Select NFT</Button>}
      </ButtonsWrapper>
    </>
  )
}

export default genericSuspense(Deposit)
