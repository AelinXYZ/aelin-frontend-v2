import styled from 'styled-components'

import { Link as BaseLink } from '@/src/components/assets/Link'
import { Cell } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(Cell)`
  cursor: pointer;
  flex-shrink: 0;
  gap: 10px;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.textColor};
    text-decoration: underline;

    .fill {
      fill: ${({ theme }) => theme.colors.textColor};
    }
  }
`

const Link = styled(BaseLink)`
  height: 10px;
  margin-top: -3px;
  width: 10px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    height: auto;
    width: auto;
  }
`

export const ExternalLink: React.FC<{ href: string }> = ({ children, href, ...restProps }) => {
  return (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        window.open(href, '_blank')
      }}
      {...restProps}
    >
      {children}
      <Link />
    </Wrapper>
  )
}
