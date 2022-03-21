import { History } from '@/src/components/assets/History'
import { Pools } from '@/src/components/assets/Pools'
import { Sponsors } from '@/src/components/assets/Sponsors'
import { Stake } from '@/src/components/assets/Stake'
import { Vest } from '@/src/components/assets/Vest'

export const sections = [
  {
    href: '/',
    icon: <Pools />,
    title: 'Pools List',
  },
  {
    href: '/sponsors',
    icon: <Sponsors />,
    title: 'Sponsors',
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
