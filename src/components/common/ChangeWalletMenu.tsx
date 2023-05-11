import styled from 'styled-components'

import { Link as LinkSVG } from '@/src/components/assets/Link'
import { Metamask } from '@/src/components/assets/Metamask'
import { CopyButton } from '@/src/components/button/CopyButton'
import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'
import { getNetworkConfig } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { shortenAddress } from '@/src/utils/string'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.componentBackgroundColor};
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 17px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  font-size: 0.9rem;
  gap: 8px;
  justify-content: center;
  margin-bottom: 10px;
  width: 100%;
`

const ExternalLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.15s linear;
  width: 12px;
  height: 12px;

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }

  &:active {
    opacity: 0.7;
  }
`

const Button = styled(ButtonPrimaryLight)`
  border-width: 0.5px;
  font-size: 0.65rem;
  font-weight: 500;
  height: 24px;
  line-height: 1.2;
  margin-bottom: 6px;
  width: 100px;

  &:last-child {
    margin-bottom: 0;
  }
`

const ChangeWalletMenu = () => {
  const { address = '', appChainId, changeWallet, disconnectWallet } = useWeb3Connection()
  const currentChain = getNetworkConfig(appChainId)

  return (
    <Wrapper>
      <Row>
        <Metamask />
      </Row>
      <Row>{address && shortenAddress(address)}</Row>
      {address && (
        <Row>
          <CopyButton copyValue={address} />
          <ExternalLink
            href={`${currentChain.blockExplorerUrls}/address/${address}`}
            target="_blank"
          >
            <LinkSVG />
          </ExternalLink>
        </Row>
      )}
      <Button onClick={changeWallet}>Change wallet</Button>
      <Button onClick={disconnectWallet}>Disconnect</Button>
    </Wrapper>
  )
}

export default ChangeWalletMenu
