import Link from 'next/link'
import styled from 'styled-components'

import { BootNodeLogo } from '@/assets/BootNodeLogo'
import { TopMenu } from '@/navigation/TopMenu'
import { InnerContainer } from '@/pureStyledComponents/layout/InnerContainer'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

const Wrapper = styled(InnerContainer)`
  flex-direction: row;
  flex-grow: 0;
  height: var(--header-height);
  justify-content: center;
  padding-bottom: ${({ theme }) => theme.header.paddingBottom};
  padding-top: ${({ theme }) => theme.header.paddingTop};
  position: sticky;
  top: 0;
`

const HomeLink = styled.span`
  transition: opacity 0.05s linear;

  &:active {
    opacity: 0.7;
  }
`

const Logo = styled(BootNodeLogo)`
  cursor: pointer;
  max-height: ${({ theme }) => theme.header.height};
`

const Menu = styled(TopMenu)`
  margin-left: auto;
`

export const Header: React.FC = (props) => {
  useScrollPosition(({ currPos, prevPos }) => {
    const direction = currPos.y > prevPos.y ? 'UP' : 'DOWN'
    // let displacement = 0

    // if (direction === 'DOWN') {
    const displacement = Math.abs(currPos.y - prevPos.y)
    // } else {
    //   displacement = prevPos.y - currPos.y
    // }

    console.log(displacement)
  }, [])

  return (
    <Wrapper as="header" {...props}>
      <Link href="/">
        <HomeLink>
          <Logo />
        </HomeLink>
      </Link>
      <Menu />
    </Wrapper>
  )
}
