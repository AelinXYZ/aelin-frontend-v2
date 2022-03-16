import type { NextPage } from 'next'
import Head from 'next/head'

import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'

const CreatePool: NextPage = () => {
  return (
    <>
      <Head>Create Pool</Head>
      <RightTimelineLayout timeline={<>Timeline stuff</>}>
        Create pool workflow.
      </RightTimelineLayout>
    </>
  )
}

export default CreatePool
