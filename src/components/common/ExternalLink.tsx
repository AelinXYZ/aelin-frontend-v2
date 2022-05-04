import styled from 'styled-components'

import { Link as LinkIcon } from '@/src/components/assets/Link'

const Wrapper = styled.a`
  align-items: center;
  color: ${({ theme }) => theme.colors.textColorLight};
  display: flex;
  gap: 5px;
  justify-content: center;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const ExternalLink: React.FC<{
  label: string
  href: string
}> = ({ href, label, ...restProps }) => {
  return (
    <Wrapper href={href} rel="noreferrer" target="_blank" {...restProps}>
      {label}
      <LinkIcon />
    </Wrapper>
  )
}

export default ExternalLink
