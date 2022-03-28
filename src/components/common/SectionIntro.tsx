import React from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled(BaseCard)<{ backgroundImage?: string }>`
  background-image: url('resources/svg/background-1.svg');
  background-position: 50% 20px;
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0 0 20px;
  padding: 20px 40px 18px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-image: ${({ backgroundImage }) =>
      backgroundImage ? `url(${backgroundImage})` : 'none'};
    background-position: ${({ backgroundImage }) => (backgroundImage ? `100% 100%` : 'initial')};
    padding: 20px 40px 25px;
  }
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-family: ${({ theme: { fonts } }) => fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 12px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    font-size: 2.4rem;
    margin-bottom: 16px;
  }
`

const Description = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 16px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    font-size: 1.4rem;
    margin-bottom: 18px;
  }
`

const Button = styled(ButtonPrimary)`
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    margin: 0;
  }
`

export const SectionIntro: React.FC<{
  backgroundImage?: string
  button?: {
    onClick: () => void
    title: string
  }
  description: string
  title: string
}> = ({ backgroundImage, button, description, title, ...restProps }) => {
  return (
    <Wrapper backgroundImage={backgroundImage} {...restProps}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {button && <Button onClick={button.onClick}>{button.title}</Button>}
    </Wrapper>
  )
}
