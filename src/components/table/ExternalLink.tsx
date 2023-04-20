import { ReactNode } from 'react'
import styled from 'styled-components'

import { Link as BaseLink } from '@/src/components/assets/Link'
import { Cell, CellProps } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(Cell)`
  cursor: pointer;
  flex-shrink: 0;
  gap: 8px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Link = styled(BaseLink)`
  height: 10px;
  margin-top: -3px;
  width: 10px;
  flex-shrink: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    height: auto;
    width: auto;
  }
`

interface ExternalLinkProps extends CellProps {
  className?: string
  href: string
  children?: ReactNode
}

export const ExternalLink = ({ children, className, href }: ExternalLinkProps) => (
  <Wrapper
    className={`${className} externalLink`}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      window.open(href, '_blank')
    }}
  >
    {children}
    <Link />
  </Wrapper>
)
