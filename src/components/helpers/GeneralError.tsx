import styled from 'styled-components'

import { FallbackProps } from 'react-error-boundary'

import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  max-width: 100%;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 20px;
  text-align: center;
  width: 100%;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 auto 40px;
  text-align: center;
  width: 100%;
`

const Button = styled(ButtonPrimary)`
  margin: 0 auto 0;
`

export const GeneralError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Wrapper>
      <Title>Oh no!</Title>
      <Text>{error.message}</Text>
      <Button onClick={resetErrorBoundary}>Try Again</Button>
    </Wrapper>
  )
}
