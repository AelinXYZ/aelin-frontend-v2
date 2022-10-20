// Note: Add "type": "module" to the package.json before running the script

import { parseUnits } from '@ethersproject/units'
import { Wallet } from '@ethersproject/wallet'
import fs from 'fs/promises'
import json2csv from 'json-2-csv'
import path from 'path'

const MAX_WALLETS = 50
const MAX_ALLOCATION = 100000
const MIN_ALLOCATION = 1

type Rows = {
  address: string
  allocation: string
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

  return fs.appendFile(path.join(folder, fileName), csv)
}

const main = async () => {
  console.log('Starting')

  const rows = []

  for (let x = 0; x < MAX_WALLETS; x++) {
    const randomWallet = Wallet.createRandom()

    const randomAllocation = parseUnits(
      String(Math.random() * (MAX_ALLOCATION - MIN_ALLOCATION) + MIN_ALLOCATION),
      18,
    ).toString()

    const row = {
      address: randomWallet.address,
      allocation: randomAllocation,
    }

    rows.push(row)
  }

  const LinusAddresses = [
    {
      address: '0xEade2f82c66eBda112987edd95E26cd3088f33DD',
      allocation: parseUnits('0.0001', 18).toString(),
    },
    {
      address: '0xF25128854443E18290FFD61200E051d94B8e4069',
      allocation: parseUnits('0.0002', 18).toString(),
    },
  ]

  const SaetaAddresses = [
    {
      address: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
      allocation: parseUnits('0.0001', 18).toString(),
    },
    {
      address: '0x051C7C18E63FE9Ec71BB4B5D2fCE2807F764dB5e',
      allocation: parseUnits('0.0002', 18).toString(),
    },
  ]

  const AlexAddresses = [
    {
      address: '0x6144DAf8e2e583cD30C3567861C8E1D95cfA51B5',
      allocation: parseUnits('0.0001', 18).toString(),
    },
  ]

  const DmitryAddresses = [
    {
      address: '0x4F1abd0E5c4506C95a4Fd5259371BD9a877D9488',
      allocation: parseUnits('0.0001', 18).toString(),
    },
  ]

  const MattAddresses = [
    {
      address: '0x4b3337f7f0f95c21b91f4e9be5f90d4992129c58',
      allocation: parseUnits('0.0001', 18).toString(),
    },
  ]

  rows.push(...LinusAddresses)
  rows.push(...SaetaAddresses)
  rows.push(...AlexAddresses)
  rows.push(...DmitryAddresses)
  rows.push(...MattAddresses)

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
