import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import { SectionIntro } from '@/src/components/section/SectionIntro'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Banner = {
  [key: number]: {
    backgroundImage: string
    title: string
    button?: {
      onClick: () => void
      title: string
    }
    secondaryButton?: {
      onClick: () => void
      title: string
    }
    description: string | JSX.Element
  }
}

const StakeBanner = ({ ...restProps }) => {
  const { appChainId } = useWeb3Connection()
  const router = useRouter()

  const bannerPerChain: Banner = useMemo(
    () => ({
      1: {
        backgroundImage: 'bg-stake.svg',
        title: 'Stake',
        description: (
          <>
            The incentive program for Aelin/ETH on L1 has concluded, and all rewards have been paid
            out. You can withdraw your LP tokens at anypoint.
            <br />
            <br />
            Still interested in earning rewards? Read more about our new incentive programs for LP's{' '}
            <a
              href="https://mirror.xyz/aelinnews.eth/0tttX4Liu0rK_1om-oyS9dnPSjO-p09DVZDpkcR9B2Y"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </>
        ),
      },
      10: {
        backgroundImage: 'bg-stake.svg',
        button: {
          onClick: () =>
            window.open(
              'https://app.velodrome.finance/liquidity/manage?address=0x3eec44e94ee86ce79f34bb26dc3cdbbee18d6d17',
              '_blank',
            ),
          title: 'Go to Velodrome!',
        },
        secondaryButton: !router.pathname.includes('deprecated')
          ? {
              onClick: () => router.push('/stake/deprecated'),
              title: 'Deprecated Pool',
            }
          : undefined,
        description: router.pathname.includes('deprecated') ? (
          <>
            The Sorbet/Arrakis Pool 2 has been deprecated. If you have funds in this pool, you will
            be able to withdraw them and move them over to Velodrome. For more information about the
            Velodrome pool click{' '}
            <a
              href="https://mirror.xyz/aelinnews.eth/0tttX4Liu0rK_1om-oyS9dnPSjO-p09DVZDpkcR9B2Y"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>
          </>
        ) : (
          <>
            Holders can stake their AELIN or AELIN/ETH liquidity tokens to receive rewards and deal
            fees. If you already have funds in the deprecated Sorbet/Arrakis Pool 2, you can easily
            withdraw them and move them over to the new Velodrome AELIN/wETH Pool 2. For more
            information on the Velodrome pool click{' '}
            <a
              href="https://mirror.xyz/aelinnews.eth/0tttX4Liu0rK_1om-oyS9dnPSjO-p09DVZDpkcR9B2Y"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </>
        ),
        title: 'Stake',
      },
      42161: {
        backgroundImage: 'bg-stake.svg',
        title: 'Stake',
        description: (
          <>
            There is currently no staking program on Arbitrum.
            <br />
            <br />
            Still interested in earning rewards? Read more about our new incentive programs for LP's{' '}
            <a
              href="https://mirror.xyz/aelinnews.eth/0tttX4Liu0rK_1om-oyS9dnPSjO-p09DVZDpkcR9B2Y"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </>
        ),
      },
      5: {
        backgroundImage: 'bg-pools.svg',
        title: 'Feature not available',
        description: `Staking is not available on test networks.`,
      },
      42: {
        backgroundImage: 'bg-pools.svg',
        title: 'Feature not available',
        description: `Staking is not available on test networks.`,
      },
      421613: {
        backgroundImage: 'bg-pools.svg',
        title: 'Feature not available',
        description: `Staking is not available on test networks.`,
      },
    }),
    [router],
  )

  const banner = bannerPerChain[appChainId]

  return (
    <SectionIntro
      backgroundImage={`resources/svg/${banner.backgroundImage}`}
      button={'button' in banner ? banner.button : undefined}
      secondaryButton={'secondaryButton' in banner ? banner.secondaryButton : undefined}
      title={banner.title}
      {...restProps}
    >
      {banner.description}
    </SectionIntro>
  )
}

export default StakeBanner
