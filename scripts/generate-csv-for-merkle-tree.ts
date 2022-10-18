// Note: Add "type": "module" to the package.json before running the script

import { Wallet } from '@ethersproject/wallet'
import fs from 'fs/promises'
import json2csv from 'json-2-csv'
import path from 'path'

const MAX_WALLETS = 10000
const MAX_ALLOCATION = 100000
const MIN_ALLOCATION = 1

type Rows = {
  address: string
  allocation: number
}
const fileExists = async (path: string) => !!(await fs.stat(path).catch((e) => false))

const createCSVFile = async (rows: Rows[]) => {
  const csv = await json2csv.json2csvAsync(rows)

  const fileName = 'csv-for-merkel-tree.csv'
  const folder = `${process.cwd()}/public/data/csv-for-merkel-tree/`

  const isExist = await fileExists(path.join(folder, fileName))

  if (isExist) {
    await fs.unlink(path.join(folder, fileName))
  }

  return fs.appendFile(
    `${process.cwd()}/public/data/csv-for-merkel-tree/csv-for-merkel-tree.csv`,
    csv,
  )
}

const main = async () => {
  console.log('Starting')

  const rows = []

  for (let x = 0; x < MAX_WALLETS; x++) {
    const randomWallet = Wallet.createRandom()
    const randomAllocation = Math.round(
      Math.random() * (MAX_ALLOCATION - MIN_ALLOCATION) + MIN_ALLOCATION,
    )

    const row = {
      address: randomWallet.address,
      allocation: randomAllocation,
    }

    rows.push(row)
  }

  return createCSVFile(rows)
}

main()
  .then(() => {
    console.log('CSV has been created successfully')
    process.exit(0)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .catch((e: any) => {
    console.error(e)
    process.exit(1)
  })
