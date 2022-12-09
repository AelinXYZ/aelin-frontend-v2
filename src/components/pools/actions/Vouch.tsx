import styled from 'styled-components'

import { ButtonGradient } from '../../pureStyledComponents/buttons/Button'
import { BaseCard } from '../../pureStyledComponents/common/BaseCard'
import { Tooltip } from '../../tooltip/Tooltip'
import { Contents as BaseContents, Title as BaseTitle } from './Wrapper'

const Container = styled(BaseCard)`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: fit-content;
  justify-content: center;
  padding: 30px 55px;
  gap: 10px;
`
const Title = styled(BaseTitle)`
  margin-bottom: 0;
  text-align: center;
`
const Contents = styled(BaseContents)`
  text-align: center;
  font-size: 1.5rem;
`
const Vouchers = styled.span`
  color: ${({ theme }) => theme.buttonPrimary.color};
`
const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 5px;
`

const VouchButton = styled(ButtonGradient)`
  width: 100%;
`

export const Vouch = () => {
  return (
    <Container>
      <TitleWrapper>
        <Title>Vouch for this pool</Title>
        <Tooltip text="something" />
      </TitleWrapper>
      <Contents>
        Total vouchers : <Vouchers>13</Vouchers>{' '}
      </Contents>
      <VouchButton>Vouch</VouchButton>
    </Container>
  )
}
