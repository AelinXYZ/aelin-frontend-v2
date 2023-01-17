/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'

import { isAddress } from '@ethersproject/address'
import { ParseResult } from 'papaparse'
import { useCSVReader } from 'react-papaparse'

import { AddressWhiteListProps } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'

export interface IUploadCSV {
  onUploadCSV: (data: AddressWhiteListProps[]) => void
}

const UploadCSV: FC<IUploadCSV> = ({ onUploadCSV }) => {
  const { CSVReader } = useCSVReader()

  const handleOnDrop = (csv: ParseResult<string[]>) => {
    let index = 0
    // Filter incomplete or wrong rows
    const whitelist = csv.data.reduce((accum, curr) => {
      const [address, amount] = curr

      if (isAddress(address) && amount !== '') {
        accum.push({ index, address, amount: amount })
        index++
      }

      return accum
    }, [] as AddressWhiteListProps[])

    onUploadCSV(whitelist)
  }

  return (
    <CSVReader noDrag onUploadAccepted={handleOnDrop}>
      {({ getRootProps }: any) => (
        <ButtonPrimaryLightSm type="button" {...getRootProps()}>
          Upload CSV
        </ButtonPrimaryLightSm>
      )}
    </CSVReader>
  )
}

export default UploadCSV
