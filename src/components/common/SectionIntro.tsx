import React from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled(BaseCard)`
  margin: 0 0 20px;
  padding: 20px 40px 25px;
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-family: ${({ theme: { fonts } }) => fonts.fontFamilyTitle};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 16px;
`

const Description = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 16px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SectionIntro: React.FC<{
  button?: {
    onClick: () => void
    title: string
  }
  description: string
  title: string
}> = ({ button, description, title, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {button && <ButtonPrimary onClick={button.onClick}>{button.title}</ButtonPrimary>}
    </Wrapper>
  )
}
