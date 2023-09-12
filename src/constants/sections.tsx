import { Fees } from '@/src/components/assets/Fees'
import { History } from '@/src/components/assets/History'
import { Pools } from '@/src/components/assets/Pools'
import { Stats } from '@/src/components/assets/Stats'

export const sections = [
  {
    href: '/',
    icon: <Pools />,
    title: 'Pools List',
  },
  {
    href: '/burn',
    title: 'Swap/Burn Aelin',
  },
  {
    href: '/stats',
    icon: <Stats />,
    title: 'Stats',
  },
  {
    href: '/history',
    icon: <History />,
    title: 'History',
  },
  {
    href: '/fees',
    icon: <Fees />,
    title: 'Fees',
  },
]
