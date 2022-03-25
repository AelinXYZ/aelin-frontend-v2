import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Ellipsis } from '@/src/components/assets/Ellipsis'
import { BootNodeLogo } from '@/src/components/assets/Logo'
import { Metamask } from '@/src/components/assets/Metamask'
import { Notifications } from '@/src/components/common/Notifications'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/dropdown/Dropdown'
import { TopMenu as BaseTopMenu } from '@/src/components/navigation/TopMenu'
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
  margin: 0 0 15px;
  position: sticky;
  top: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    margin-bottom: 20px;
  }
`

const InnerContainer = styled(BaseInnerContainer)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    ${BaseCardCSS}
    padding: 12px 20px 12px 40px;
  }

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    justify-content: center;
    padding: 1em 0 0;
  }
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
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    align-items: center;
    display: flex;
    gap: 20px;
  }
`

const TopMenu = styled(BaseTopMenu)`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    display: flex;
    margin-left: auto;
    margin-right: 30px;
  }
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
            dropdownPosition={DropdownPosition.right}
            items={chainOptions.map((item, index) => (
              <DropdownItem
                key={index}
                onClick={() => {
                  setCurrentChain(item.name)
                  setAppChainId(item.chainId)
                }}
              >
                {getNetworkConfig(item.chainId).icon}
                {item.name}
              </DropdownItem>
            ))}
          />
          {isWalletConnected && (
            <>
              <Line />
              <Dropdown
                dropdownButtonContent={
                  <DropdownButton>
                    <Metamask />
                    {address && <Item>{truncateStringInTheMiddle(address, 6, 6)}</Item>}
                    <ChevronDown />
                  </DropdownButton>
                }
                dropdownPosition={DropdownPosition.right}
                items={[
                  <DropdownItem key={'btn_disconnect'} onClick={disconnectWallet}>
                    Disconnect
                  </DropdownItem>,
                ]}
              />
              <Line />
              <Notifications />
              <Line />
              <Ellipsis />
            </>
          )}
          {!isWalletConnected && (
            <>
              <Line />
              <ButtonPrimary onClick={connectWallet}>Connect</ButtonPrimary>
            </>
          )}
        </EndWrapper>
      </InnerContainer>
    </Wrapper>
  )
}
