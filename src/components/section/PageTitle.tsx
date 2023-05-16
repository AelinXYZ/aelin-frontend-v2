import { ReactNode } from 'react'
import styled from 'styled-components'

import { Substack } from '../assets/Substack'
import { Discord } from '@/src/components/assets/Discord'
import { Link as BaseLink } from '@/src/components/assets/Link'
import { Medium } from '@/src/components/assets/Medium'
import { Mirror } from '@/src/components/assets/Mirror'
import { Twitter } from '@/src/components/assets/Twitter'
import { Verified } from '@/src/components/assets/Verified'
import { PoolSocials } from '@/src/constants/verifiedPoolsSocials'

const Wrapper = styled.div`
  margin: 0 auto 30px;
  max-width: 100%;
  width: ${({ theme }) => theme.layout.maxWidth};
`

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 4px;
  padding: 20px 0 0 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 1.5rem;
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
  font-size: 0.9rem;
  font-weight: 500;
  gap: 8px;
  line-height: 1.3;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 0.9rem;
  }

  .networkIcon {
    height: 14px;
    width: 14px;
  }
`

const WebsiteLinkWrapper = styled.div`
  display: flex;
  margin-top: 4px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin-top: 12px;
  }
`

const WebsiteLink = styled.a`
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.gradientEnd};
  text-decoration: none;
`

const Socials = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 4px;
  gap: 12px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin-top: 12px;
  }
`

export const PageTitle: React.FC<{
  href?: string
  network?: ReactNode
  subTitle?: string
  title: string | React.ReactNode
  isVerified?: boolean
  poolSocials?: PoolSocials
}> = ({ href, isVerified, network, poolSocials, subTitle, title, ...restProps }) => {
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
      {poolSocials?.websiteName && (
        <WebsiteLinkWrapper>
          <WebsiteLink href={`https://${poolSocials.websiteName}`} rel="noreferrer" target="_blank">
            {poolSocials.websiteName}
          </WebsiteLink>
        </WebsiteLinkWrapper>
      )}
      {(poolSocials?.twitterHandle ||
        poolSocials?.discordServerInvite ||
        poolSocials?.mirrorHashPost ||
        poolSocials?.mediumPost ||
        poolSocials?.substackPost) && (
        <Socials>
          {poolSocials?.twitterHandle && (
            <a
              href={`https://twitter.com/${poolSocials.twitterHandle}`}
              rel="noreferrer"
              target="_blank"
            >
              <Twitter />
            </a>
          )}
          {poolSocials?.discordServerInvite && (
            <a
              href={`https://discord.gg/${poolSocials.discordServerInvite}`}
              rel="noreferrer"
              target="_blank"
            >
              <Discord />
            </a>
          )}
          {poolSocials?.mirrorHashPost && (
            <a
              href={`https://mirror.xyz/${poolSocials.mirrorHashPost}`}
              rel="noreferrer"
              target="_blank"
            >
              <Mirror />
            </a>
          )}
          {poolSocials?.mediumPost && (
            <a
              href={`https://medium.com/${poolSocials.mediumPost}`}
              rel="noreferrer"
              target="_blank"
            >
              <Medium />
            </a>
          )}
          {poolSocials?.substackPost && (
            <a href={poolSocials.substackPost} rel="noreferrer" target="_blank">
              <Substack />
            </a>
          )}
        </Socials>
      )}
    </Wrapper>
  )
}
