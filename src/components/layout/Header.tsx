import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { BootNodeLogo } from '@/src/components/assets/Logo'
import { Dropdown, DropdownItem } from '@/src/components/dropdown/Dropdown'
import { TopMenu } from '@/src/components/navigation/TopMenu'
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
  margin: 0 0 20px;
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
  gap: 20px;
`

const ButtonWrapper = styled.div`
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

const Line = styled.div`
  background: rgba(255, 255, 255, 0.25);
  height: 24px;
  width: 1px;
`

const DropdownButton = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 8px;
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
        <TopMenu />
        <EndWrapper>
          <Dropdown
            currentItem={chainOptions.findIndex(({ id }) => id === appChainId)}
            dropdownButtonContent={
              <DropdownButton>
                {getNetworkConfig(appChainId).icon}
                {currentChain}
                <ChevronDown />
              </DropdownButton>
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
          <Line />
          Notifications
          <Line />
          {isWalletConnected && (
            <ExtraInfo>
              {wallet?.name}
              &nbsp;&nbsp;&nbsp;
              {address && <Item>{truncateStringInTheMiddle(address, 6, 6)}</Item>}
              <ButtonWrapper>
                <ButtonPrimary onClick={disconnectWallet}>Disconnect</ButtonPrimary>
              </ButtonWrapper>
            </ExtraInfo>
          )}
          {!isWalletConnected && <ButtonPrimary onClick={connectWallet}>Connect</ButtonPrimary>}
          <Line />
          Ellipsis
        </EndWrapper>
      </InnerContainer>
    </Wrapper>
  )
}
