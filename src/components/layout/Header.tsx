import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

import { ChevronDown as BaseChevronDown } from '@/src/components/assets/ChevronDown'
import { BootNodeLogo } from '@/src/components/assets/Logo'
import { Dropdown, DropdownItem } from '@/src/components/dropdown/Dropdown'
import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCardCSS } from '@/src/components/pureStyledComponents/common/BaseCard'
import { InnerContainer as BaseInnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'
import { chainsConfig, getNetworkConfig } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { truncateStringInTheMiddle } from '@/src/utils/tools'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 0;
  height: ${({ theme }) => theme.header.height};
  position: sticky;
  top: 0;
`

const InnerContainer = styled(BaseInnerContainer)`
  ${BaseCardCSS}

  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 20px 12px 40px;
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

const StartWrapper = styled.div`
  align-items: center;
  display: flex;
`

const EndWrapper = styled.div`
  align-items: center;
  display: flex;
`

const ButtonWrapper = styled.div`
  margin-left: 10px;
`

const ChevronDown = styled(BaseChevronDown)`
  margin-left: 10px;
`

const ExtraInfo = styled.div`
  align-items: center;
  display: flex;
`

const Item = styled.div`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Header: React.FC = (props) => {
  const {
    address = '',
    appChainId,
    connectWallet,
    disconnectWallet,
    isWalletConnected,
    setAppChainId,
    wallet,
  } = useWeb3Connection()

  const chainOptions = Object.values(chainsConfig)

  const [currentChain, setCurrentChain] = useState(getNetworkConfig(appChainId).name)

  return (
    <Wrapper as="header" {...props}>
      <InnerContainer>
        <StartWrapper>
          <Link href="/" passHref>
            <HomeLink>
              <Logo />
            </HomeLink>
          </Link>
        </StartWrapper>
        <div>
          <Link href="pools-list">Pools List</Link>&nbsp;&nbsp;&nbsp;
          <Link href="sponsors">Sponsors</Link>&nbsp;&nbsp;&nbsp;
          <Link href="stake">Stake Aelin</Link>&nbsp;&nbsp;&nbsp;
          <Link href="vest">Vest</Link>&nbsp;&nbsp;&nbsp;
          <Link href="history">History</Link>&nbsp;&nbsp;&nbsp;
          <Link href="notifications">Nofitications</Link>
        </div>
        <EndWrapper>
          <Dropdown
            currentItem={chainOptions.findIndex(({ id }) => id === appChainId)}
            dropdownButtonContent={
              <ButtonPrimary>
                {currentChain}
                <ChevronDown />
              </ButtonPrimary>
            }
            items={chainOptions.map((item, index) => (
              <DropdownItem
                key={index}
                onClick={() => {
                  setCurrentChain(item.name)
                  setAppChainId(item.chainId)
                }}
              >
                {item.name}
              </DropdownItem>
            ))}
          />
          {isWalletConnected ? (
            <ExtraInfo>
              {wallet?.name}
              &nbsp;&nbsp;&nbsp;
              {address && <Item>{truncateStringInTheMiddle(address, 6, 6)}</Item>}
              <ButtonWrapper>
                <ButtonPrimary onClick={disconnectWallet}>Disconnect</ButtonPrimary>
              </ButtonWrapper>
            </ExtraInfo>
          ) : (
            <ButtonPrimary onClick={connectWallet}>Connect</ButtonPrimary>
          )}
        </EndWrapper>
      </InnerContainer>
    </Wrapper>
  )
}
