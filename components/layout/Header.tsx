import Link from 'next/link'
import styled from 'styled-components'

import { BootNodeLogo } from '@/components/assets/BootNodeLogo'
import { InnerContainer as BaseInnerContainer } from '@/components/pureStyledComponents/layout/InnerContainer'

const Wrapper = styled.div`
  align-items: center;
  background-color: #000;
  display: flex;
  flex-grow: 0;
  height: ${({ theme }) => theme.header.height};
  position: sticky;
  top: 0;
`

const InnerContainer = styled(BaseInnerContainer)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

const HomeLink = styled.span`
  transition: opacity 0.05s linear;

  &:active {
    opacity: 0.7;
  }
`

const Logo = styled(BootNodeLogo)`
  cursor: pointer;
  max-height: calc(${({ theme }) => theme.header.height} - 20px);
`

export const Header: React.FC = (props) => {
  return (
    <Wrapper as="header" {...props}>
      <InnerContainer>
        <Link href="/">
          <HomeLink>
            <Logo />
          </HomeLink>
        </Link>
      </InnerContainer>
    </Wrapper>
  )
}
