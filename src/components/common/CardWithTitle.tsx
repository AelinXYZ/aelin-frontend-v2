import React from 'react'
import styled, { css } from 'styled-components'

import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled(BaseCard)`
  padding: 0;
`

const Titles = styled.div`
  display: flex;
  width: 100%;
`

const TitleActiveCSS = css`
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gradientStart} 9.37%,
    ${({ theme }) => theme.colors.gradientEnd} 100%
  );
  cursor: default;
  font-weight: 600;

  &:active {
    opacity: 1;
  }
`

export const CardTitle = styled.h2<{ isActive?: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  font-size: 1.2rem;
  font-weight: 400;
  justify-content: center;
  line-height: 1.4;
  margin: 0;
  min-height: 36px;
  padding: 0 20px;
  text-align: center;
  transition: opacity 0.15s linear;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
    min-height: 50px;
  }

  &:active {
    opacity: 0.7;
  }

  ${({ isActive }) => isActive && TitleActiveCSS}

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }
`

CardTitle.defaultProps = {
  isActive: true,
}

const Inner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    padding: 20px 45px 40px;
  }
`

export const CardWithTitle: React.FC<{ titles: React.ReactNode }> = ({
  children,
  titles,
  ...restProps
}) => (
  <Wrapper {...restProps}>
    <Titles>{titles}</Titles>
    <Inner className="cardWithTitleInner">{children}</Inner>
  </Wrapper>
)
