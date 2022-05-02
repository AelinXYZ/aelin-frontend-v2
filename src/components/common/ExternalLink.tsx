import styled from 'styled-components'

import { Link as LinkIcon } from '@/src/components/assets/Link'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    margin-left: 5px;
  }
`

type Props = {
  label: string
  href: string
}

export default function ExternalLink({ href, label }: Props) {
  return (
    <Wrapper>
      {label}
      <a href={href} rel="noreferrer" target="_blank">
        <LinkIcon />
      </a>
    </Wrapper>
  )
}
