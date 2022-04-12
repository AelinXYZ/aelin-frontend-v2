import styled from 'styled-components'

import { BigNumberInput } from 'big-number-input'

import { Textfield as BaseTextField } from '@/src/components/pureStyledComponents/form/Textfield'

const Wrapper = styled.div`
  width: 100%;
`

const InputWrapper = styled.div`
  margin-bottom: 10px;
  position: relative;
`

const Textfield = styled(BaseTextField)`
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
  font-size: 0.9rem;
  font-size: 1rem;
  font-weight: 400;
  font-weight: 500;
  height: 14px;
  padding: 0;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
`

const Balance = styled.div`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 40px;
`

interface Props {
  decimals: number
  disabled?: boolean
  error: boolean
  maxDisabled?: boolean
  maxValue: string
  maxValueFormatted: string
  setValue: (value: string) => void
  value: string
}

export const TokenInput = ({
  decimals,
  disabled,
  error,
  maxDisabled,
  maxValue,
  maxValueFormatted,
  setValue,
  value,
  ...restProps
}: Props) => {
  const setMax = () => setValue(maxValue)

  return (
    <Wrapper {...restProps}>
      <InputWrapper>
        <BigNumberInput
          decimals={decimals}
          onChange={setValue}
          renderInput={() => (
            <Textfield disabled={disabled} error={error} placeholder="0" type="number" />
          )}
          value={value}
        />
        <MaxButton disabled={maxDisabled} onClick={setMax}>
          Max
        </MaxButton>
      </InputWrapper>
      <Balance>Balance: {maxValueFormatted} Pool tokens</Balance>
    </Wrapper>
  )
}
