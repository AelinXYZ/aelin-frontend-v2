import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { TextPrimary } from '../../pureStyledComponents/text/Text'
import { TokenInput } from '@/src/components/form/TokenInput'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { AmountTypes, useUserAvailableToDeposit } from '@/src/hooks/aelin/useUserAvailableToDeposit'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { useNftSelection } from '@/src/providers/nftSelectionProvider'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isPrivatePool } from '@/src/utils/aelinPoolUtils'
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
  const { handleOpenNftSelectionModal, hasStoredSelectedNft, storedSelectedNfts } =
    useNftSelection()
  const { investmentTokenDecimals, investmentTokenSymbol } = pool
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

    const isInputError =
      tokenInputValue && BigNumber.from(tokenInputValue).gt(sortedBalances[0].raw)

    if (!isInputError) {
      setInputError('')
    } else {
      sortedBalances[0].type === AmountTypes.maxDepositAllowedPrivate
        ? setInputError(`Max allowed to invest is ${sortedBalances[0].formatted}`)
        : sortedBalances[0].type === AmountTypes.maxDepositAllowed
        ? setInputError(`Max cap allowance ${sortedBalances[0].formatted}`)
        : setInputError(`Insufficient balance`)
    }
  }, [investmentTokenBalance.raw, sortedBalances, tokenInputValue])

  const depositTokens = async () => {
    if (inputError) {
      return
    }

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = pool.hasNftList
          ? await purchasePoolTokensWithNft([storedSelectedNfts, tokenInputValue], txGasOptions)
          : await purchasePoolTokens([tokenInputValue], txGasOptions)
        if (receipt) {
          refetchBalances()
          setTokenInputValue('')
          setInputError('')
        }
      },
      title: `Deposit ${investmentTokenSymbol}`,
      estimate: () =>
        pool.hasNftList
          ? purchasePoolTokensWithNftEstimate([storedSelectedNfts, tokenInputValue])
          : purchasePoolTokensEstimate([tokenInputValue]),
    })
  }

  return (
    <>
      <StyledTokenInput
        decimals={investmentTokenDecimals}
        error={inputError}
        isPrivate={isPrivatePool(pool.poolType)}
        maxValue={sortedBalances[0].raw.toString()}
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
          Deposit
        </Button>
        {pool.hasNftList && <Button onClick={handleOpenNftSelectionModal}>Select NFT</Button>}
      </ButtonsWrapper>
    </>
  )
}

export default genericSuspense(Deposit)
