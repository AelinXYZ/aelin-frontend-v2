import { History } from '@/src/components/assets/History'
import { Pools } from '@/src/components/assets/Pools'
import { Stake } from '@/src/components/assets/Stake'
import { Stats } from '@/src/components/assets/Stats'
import { Vest } from '@/src/components/assets/Vest'

export const sections = [
  {
    href: '/',
    icon: <Pools />,
    title: 'Pools List',
  },
  {
    href: '/stats',
    icon: <Stats />,
    title: 'Stats',
  },
  {
    href: '/stake',
    icon: <Stake />,
    title: 'Stake Aelin',
  },
  {
    href: '/vest',
    icon: <Vest />,
    title: 'Vest',
  },
  {
    href: '/history',
    icon: <History />,
    title: 'History',
  },
]
