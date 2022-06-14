import { ReactNode } from 'react'
import styled from 'styled-components'

import { Link as BaseLink } from '@/src/components/assets/Link'
import { Verified } from '@/src/components/assets/Verified'

const Wrapper = styled.div`
  margin: 0 auto 30px;
  max-width: 100%;
  width: ${({ theme }) => theme.layout.maxWidth};
`

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 4px;
  padding: 20px 0 0 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 2.4rem;
    margin-bottom: 12px;
  }
`

const TitleText = styled.span`
  align-items: center;
  justify-content: left;
  color: ${({ theme }) => theme.pageTitle.color};
  display: flex;
  gap: 12px;

  width: 370px;
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    width: 640px;
  }

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;

  &[href]:hover {
    text-decoration: none;
  }
`

const Link = styled(BaseLink)`
  --dimensions: 12px;

  height: var(--dimensions);
  width: var(--dimensions);

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    --dimensions: 15px;

    height: var(--dimensions);
    width: var(--dimensions);
  }
`

const SubTitle = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.textColorLight};
  display: flex;
  font-size: 1.2rem;
  font-weight: 500;
  gap: 8px;
  line-height: 1.3;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }

  .networkIcon {
    height: 14px;
    width: 14px;
  }
`

export const PageTitle: React.FC<{
  href?: string
  network?: ReactNode
  subTitle?: string
  title: string | React.ReactNode
  isVerified?: boolean
}> = ({ href, isVerified, network, subTitle, title, ...restProps }) => {
  const titleLinkProps = href ? { href: href, target: '_blank' } : {}

  return (
    <Wrapper {...restProps}>
      <Title>
        <TitleText as={'span'}>
          {title} {isVerified && <Verified />}{' '}
          {href && (
            <a {...titleLinkProps}>
              <Link />
            </a>
          )}
        </TitleText>
      </Title>
      <SubTitle>
        {subTitle ? subTitle : '--'}
        {network && ' - '}
        {network}
      </SubTitle>
    </Wrapper>
  )
}
