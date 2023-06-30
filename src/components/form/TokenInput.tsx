import styled from 'styled-components'

import { BigNumberInput } from 'big-number-input'

import {
  Textfield as BaseTextField,
  TextfieldState,
} from '@/src/components/pureStyledComponents/form/Textfield'
import { Error } from '@/src/components/pureStyledComponents/text/Error'

const Wrapper = styled.div`
  margin-bottom: 20px;
  width: 100%;
`

const InputWrapper = styled.div`
  margin-bottom: 10px;
  position: relative;
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Textfield: any = styled(BaseTextField)`
  padding-right: 40px;
  position: relative;
  width: 100%;
  z-index: 5;
`

const MaxButton = styled.button`
  background: none;
  border-radius: 3px;
  border: none;
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 400;
  padding: 0;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.15s linear;
  z-index: 10;

  &:active {
    opacity: 0.7;
  }
`

const Balance = styled.div`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
`

const Allocation = styled(Balance)`
  margin-top: 5px;
`

interface Props {
  decimals: number
  disabled?: boolean
  error?: string
  maxDisabled?: boolean
  maxValue?: string
  withBalance?: boolean
  withMaxButton?: boolean
  maxValueFormatted?: string
  setValue: (value: string) => void
  value: string
  symbol?: string
  maxAllocationFormatted?: string
}

export const TokenInput = ({
  decimals,
  disabled,
  error,
  maxAllocationFormatted,
  maxDisabled,
  maxValue = '',
  maxValueFormatted,
  setValue,
  symbol,
  value,
  withBalance = true,
  withMaxButton = true,
  ...restProps
}: Props) => {
  const setMax = () => setValue(maxValue)

  return (
    <Wrapper {...restProps}>
      <InputWrapper>
        <BigNumberInput
          decimals={decimals}
          onChange={setValue}
          renderInput={(props) => (
            <Textfield
              disabled={disabled}
              placeholder="0"
              status={error ? TextfieldState.error : undefined}
              type="number"
              {...props}
            />
          )}
          value={value}
        />
        {withMaxButton && (
          <MaxButton disabled={maxDisabled} onClick={setMax}>
            Max
          </MaxButton>
        )}
      </InputWrapper>
      {withBalance && (
        <Balance>
          Balance: {maxValueFormatted} {symbol ? symbol : 'Pool tokens'}
        </Balance>
      )}
      {!!maxAllocationFormatted && <Allocation>Allocation: {maxAllocationFormatted}</Allocation>}
      {error && <Error>{error}</Error>}
    </Wrapper>
  )
}
