import React from 'react'
import styled from 'styled-components'

import { Tooltip } from '@/src/components/tooltip/Tooltip'

const Wrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.infoCell.borderBottomColor};
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 6px;
  margin: 0 0 6px;
`

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  white-space: normal;
  word-break: break-word;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

const Contents = styled.div``

export const Value = styled.div`
  color: ${({ theme }) => theme.colors.textColorLight};
  display: block;
  font-size: 1.2rem;
  font-weight: 400;
  gap: 12px;
  line-height: 1.4;
  margin: 0 0 2px;
  text-decoration: none;
  white-space: normal;
  word-break: break-word;
  text-align: left;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

export const InfoCell: React.FC<{
  title: string
  tooltip?: string
  value?: React.ReactNode
}> = ({ children, title, tooltip, value, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <TitleWrapper>
        <Title>{title}</Title>
        {tooltip && <Tooltip text={tooltip} />}
      </TitleWrapper>
      <Contents>{value && !children ? <Value>{value}</Value> : children}</Contents>
    </Wrapper>
  )
}
