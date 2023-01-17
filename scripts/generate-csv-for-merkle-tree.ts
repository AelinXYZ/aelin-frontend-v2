// Note: Add "type": "module" to the package.json before running the script

import { parseUnits } from '@ethersproject/units'
import { Wallet } from '@ethersproject/wallet'
import fs from 'fs/promises'
import json2csv from 'json-2-csv'
import path from 'path'

const MAX_WALLETS = 1000
const MAX_ALLOCATION = 100
const MIN_ALLOCATION = 1
const DEFAULT_ALLOCATION_IN_DECIMALS = '10'

type Rows = {
  address: string
  allocation: string
}

const isDecimals = process.argv.indexOf('--decimals') !== -1

const fileExists = async (path: string) => !!(await fs.stat(path).catch((e) => false))

const createCSVFile = async (rows: Rows[]) => {
  const csv = await json2csv.json2csvAsync(rows)

  const fileName = isDecimals ? 'csv-for-merkel-tree-decimals.csv' : 'csv-for-merkel-tree.csv'
  const folder = `${process.cwd()}/public/data/csv-for-merkel-tree/`

  const isExist = await fileExists(path.join(folder, fileName))

  if (isExist) {
    await fs.unlink(path.join(folder, fileName))
  }

  return fs.appendFile(path.join(folder, fileName), csv)
}

const getAllocation = (isDecimals: boolean) => {
  if (isDecimals) {
    return (Math.random() * (MAX_ALLOCATION - MIN_ALLOCATION) + MIN_ALLOCATION)
      .toFixed(2)
      .toString()
  }

  return parseUnits(
    String(Math.random() * (MAX_ALLOCATION - MIN_ALLOCATION) + MIN_ALLOCATION),
    18,
  ).toString()
}

const main = async () => {
  console.log('Starting')

  const rows = []

  for (let x = 0; x < MAX_WALLETS; x++) {
    const randomWallet = Wallet.createRandom()

    const row = {
      address: randomWallet.address,
      allocation: getAllocation(isDecimals),
    }

    rows.push(row)
  }

  const LinusAddresses = [
    {
      address: '0xEade2f82c66eBda112987edd95E26cd3088f33DD',
      allocation: isDecimals ? DEFAULT_ALLOCATION_IN_DECIMALS : parseUnits('0.0001', 18).toString(),
    },
    {
      address: '0xF25128854443E18290FFD61200E051d94B8e4069',
      allocation: isDecimals ? DEFAULT_ALLOCATION_IN_DECIMALS : parseUnits('0.0002', 18).toString(),
    },
  ]

  const SaetaAddresses = [
    {
      address: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
      allocation: isDecimals ? DEFAULT_ALLOCATION_IN_DECIMALS : parseUnits('0.0001', 18).toString(),
    },
    {
      address: '0x051C7C18E63FE9Ec71BB4B5D2fCE2807F764dB5e',
      allocation: isDecimals ? DEFAULT_ALLOCATION_IN_DECIMALS : parseUnits('0.0002', 18).toString(),
    },
  ]

  const AlexAddresses = [
    {
      address: '0x6144DAf8e2e583cD30C3567861C8E1D95cfA51B5',
      allocation: isDecimals ? DEFAULT_ALLOCATION_IN_DECIMALS : parseUnits('0.0001', 18).toString(),
    },
  ]

  const DmitryAddresses = [
    {
      address: '0x4F1abd0E5c4506C95a4Fd5259371BD9a877D9488',
      allocation: isDecimals ? DEFAULT_ALLOCATION_IN_DECIMALS : parseUnits('0.0001', 18).toString(),
    },
  ]

  rows.push(...LinusAddresses)
  rows.push(...SaetaAddresses)
  rows.push(...AlexAddresses)
  rows.push(...DmitryAddresses)

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
