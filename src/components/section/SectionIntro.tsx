import React, { ReactNode } from 'react'
import styled from 'styled-components'

import {
  ButtonGradient,
  ButtonPrimaryLight,
  ButtonSecondaryGradient,
  ButtonType,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled(BaseCard)<{ backgroundImage?: string; backgroundPosition?: string }>`
  background-color: ${({ theme: { card } }) => card.backgroundColor};
  background-repeat: no-repeat;
  margin: 0 0 20px;
  padding: 20px 20px 18px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    min-height: 180px;
    max-height: 220px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-image: ${({ backgroundImage }) =>
      backgroundImage ? `url(${backgroundImage})` : 'none'};
    background-position: ${({ backgroundPosition }) =>
      backgroundPosition ? backgroundPosition : 'initial'};
    background-size: auto auto;
  }
`

const Title = styled.h1`
  color: ${({ theme: { card } }) => card.titleColor};
  font-family: ${({ theme: { fonts } }) => fonts.fontFamilyTitle};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 12px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    font-size: 1.4rem;
    margin-bottom: 16px;
  }
`

const Description = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 16px;

  &:last-child {
    margin-bottom: 0;
  }

  a {
    color: ${({ theme: { colors } }) => colors.textColor};
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    font-size: 0.9rem;
    margin-bottom: 18px;
  }
`

const ButtonPrimary = styled(ButtonGradient)`
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    margin: 0;
  }
`

const ButtonSecondary = styled(ButtonSecondaryGradient)`
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    margin: 0;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 15px;
`

type SectionIntroProps = {
  backgroundImage?: string
  backgroundPosition?: string
  button?: Array<{
    onClick: () => void
    title: string
    type: ButtonType
  }>
  secondaryButton?: {
    onClick: () => void
    title: string
  }
  title: string
  children: ReactNode
}

export const SectionIntro = ({
  backgroundImage,
  backgroundPosition,
  button,
  children,
  secondaryButton,
  title,
  ...restProps
}: SectionIntroProps) => {
  return (
    <Wrapper
      backgroundImage={backgroundImage}
      backgroundPosition={backgroundPosition}
      {...restProps}
    >
      <Title>{title}</Title>
      <Description>{children}</Description>
      {(!!button || !!secondaryButton) && (
        <ButtonWrapper>
          {button?.map((buttonAttr) =>
            buttonAttr.type === ButtonType.Primary ? (
              <ButtonPrimary key={buttonAttr.title} onClick={buttonAttr.onClick}>
                {buttonAttr.title}
              </ButtonPrimary>
            ) : (
              <ButtonSecondary key={buttonAttr.title} onClick={buttonAttr.onClick}>
                {buttonAttr.title}
              </ButtonSecondary>
            ),
          )}
          {secondaryButton && (
            <ButtonPrimaryLight onClick={secondaryButton.onClick}>
              {secondaryButton.title}
            </ButtonPrimaryLight>
          )}
        </ButtonWrapper>
      )}
    </Wrapper>
  )
}
