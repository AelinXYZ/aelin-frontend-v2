import styled from 'styled-components'

import { BigNumberInput } from 'big-number-input'

import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { InnerBlock } from '@/src/components/pureStyledComponents/common/InnerBlock'
//import { TokenIcon } from '@/src/components/pureStyledComponents/common/TokenIcon'
//import { EstimatedValue as BaseEstimatedValue } from '@/src/components/pureStyledComponents/text/EstimatedValue'
//import { ERC20ContractAsType } from '@/types/appContracts'

const Wrapper = styled(InnerBlock)<{ error?: boolean }>`
  border-color: ${({ error, theme }) => (error ? theme.colors.error : theme.colors.grayDark)};
  padding: 10px 10px 5px 10px;
  transition: border-color 0.1s linear;

  // delete these ones, adding just for testing
  height: 100px;
  background-color: gray;

  &:focus-within {
    border-color: ${({ error, theme }) => (error ? theme.colors.error : theme.colors.primary)};
  }
`

const DepositTop = styled.div`
  column-gap: 8px;
  display: grid;
  grid-template-columns: 24px 1fr;
`

const Balance = styled.div`
  display: flex;
  justify-content: space-between;
`

const BalanceValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  justify-content: center;
`

const BalanceValue = styled.div`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1.2;
`

const BalanceSymbol = styled.div`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 0.9rem;
  font-style: italic;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
`

const UltraMiniButton = styled(ButtonPrimary)`
  height: 14px;
  border-radius: 3px;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0 3px;
  text-transform: uppercase;
`

const Input: any = styled.input<{ error: boolean }>`
  background-color: transparent;
  border: none;
  color: ${({ error, theme }) => (error ? theme.colors.error : theme.colors.textColorLighter)};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 3.4rem;
  font-weight: 500;
  height: 3.4rem;
  margin: auto 0 0 0;
  outline: none;
  overflow: hidden;
  padding: 0;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  &:active,
  &:focus {
    background-color: transparent;
    border-color: transparent;
  }

  &[disabled],
  &[disabled]:hover {
    background-color: transparent;
    border-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:disabled::placeholder {
    color: ${({ theme }) => theme.colors.textColorLighter}!important;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textColorLighter};
    font-size: 3.4rem;
    font-weight: 500;
    opacity: 0.7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &[readonly] {
    background-color: transparent;
    border-color: transparent;
    color: ${({ theme }) => theme.colors.textColorLighter};
    cursor: default;
    opacity: 0.7;
  }

  &[type='number'] {
    -moz-appearance: textfield;
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &::-webkit-search-decoration {
    -webkit-appearance: none;
  }
`

interface Props {
  balance: string
  balanceFormatted: string
  decimals: number
  disabled?: boolean
  error: boolean
  //icon?: JSX.Element
  maxDisabled?: boolean
  hideMax?: boolean
  setValue: (value: string) => void
  //tokenSymbol: ERC20ContractAsType
  value: string
  //valueInUSD: string
}

export const TokenInput = ({
  balance,
  balanceFormatted,
  decimals,
  disabled,
  error,
  // icon,
  hideMax,
  maxDisabled,
  setValue,
  // tokenSymbol,
  value,
  // valueInUSD,
  ...restProps
}: Props) => {
  const setMax = () => setValue(balance)

  return (
    <Wrapper error={error} {...restProps}>
      <DepositTop>
        {/* {icon && <TokenIcon size="24px">{icon}</TokenIcon>} */}
        <Balance>
          <BalanceValueWrapper>
            <BalanceValue>{balanceFormatted}</BalanceValue>
            {/* <BalanceSymbol>{tokenSymbol}</BalanceSymbol> */}
          </BalanceValueWrapper>
          {!hideMax && (
            <UltraMiniButton disabled={maxDisabled} onClick={setMax}>
              Max
            </UltraMiniButton>
          )}
        </Balance>
      </DepositTop>
      <BigNumberInput
        decimals={decimals}
        onChange={setValue}
        renderInput={(props) => (
          <Input disabled={disabled} error={error} placeholder="0" type="number" {...props} />
        )}
        value={value}
      />
    </Wrapper>
  )
}
