import { History } from '@/src/components/assets/History'
import { Pools } from '@/src/components/assets/Pools'
import { Sponsors } from '@/src/components/assets/Sponsors'
import { Stake } from '@/src/components/assets/Stake'
import { Vest } from '@/src/components/assets/Vest'

export const myPools = [
  {
    href: '/',
    icon: <Pools />,
    title: 'Invested',
  },
  {
    href: '/sponsors',
    icon: <Sponsors />,
    title: 'Sponsored',
  },
  {
    href: '/stake',
    icon: <Stake />,
    title: 'Funded',
  },
]
