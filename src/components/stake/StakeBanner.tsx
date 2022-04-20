import { SectionIntro } from '@/src/components/common/SectionIntro'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const StakeBannerByNetwork = {
  1: (
    <SectionIntro
      backgroundImage="resources/svg/bg-stake.svg"
      button={{
        title: 'Go to Uniswap',
        onClick: () =>
          window.open(
            'https://app.uniswap.org/#/add/v2/0xa9c125bf4c8bb26f299c00969532b66732b1f758/ETH?chain=mainnet',
            '_blank',
          ),
      }}
      description={`
      <p>
        Aelin Tokenholders can stake their AELIN or AELIN/ETH liquidity tokens to receive
        inflationary reward, deal fees, and governance voting power. Read more about the
        benefits of staking Aelin <a target="_blank" href="https://docs.aelin.xyz/general-info/staking">here</a>.
      <p/>
      <p>
      To obtain UNI-V2 AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH pool on Uniswap.
      </p>
    `}
      title="Stake"
    />
  ),
  10: (
    <SectionIntro
      backgroundImage="resources/svg/bg-stake.svg"
      button={{
        title: 'Go to Sorbet.Finance',
        onClick: () =>
          window.open(
            'https://www.sorbet.finance/#/pools/0x665d8D87ac09Bdbc1222B8B9E72Ddcb82f76B54A',
            '_blank',
          ),
      }}
      description={`
      <p>
        Aelin Tokenholders can stake their AELIN or AELIN/ETH liquidity tokens to receive
        inflationary reward, deal fees, and governance voting power. Read more about the
        benefits of staking Aelin <a target="_blank" href="https://docs.aelin.xyz/general-info/staking">here</a>.
      <p/>
      <p>
        To obtain G-UNI AELIN/ETH LP tokens, first
        provide liquidity into the AELIN/ETH pool on Uniswap via Sorbet.Finance. A full
        tutorial can be found on our blog <a target="_blank" href="https://mirror.xyz/aelingov.eth/vWMW887qout1flAyGJZ0mPJdpfrdaPSQeRt9X6cQqkQ">here</a>.
      </p>
    `}
      title="Stake"
    />
  ),
  5: <></>,
  42: <></>,
}

const StakeBanner = () => {
  const { appChainId } = useWeb3Connection()

  return StakeBannerByNetwork[appChainId]
}

export default StakeBanner
