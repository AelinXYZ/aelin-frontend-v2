/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'

import { isAddress } from '@ethersproject/address'
import { ParseResult } from 'papaparse'
import { useCSVReader } from 'react-papaparse'

import { CSVParseType } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'

export interface IUploadCSV {
  onUploadCSV: (data: CSVParseType[]) => void
}

const UploadCSV: FC<IUploadCSV> = ({ onUploadCSV }) => {
  const { CSVReader } = useCSVReader()

  const handleOnDrop = (csv: ParseResult<string[]>) => {
    // Filter incomplete or wrong rows
    const whitelist = csv.data.reduce((accum, curr, index) => {
      const [address, amount] = curr

      if (isAddress(address) && amount !== '') {
        // add index
        accum.push([index, address, amount])
      }

      return accum
    }, [] as CSVParseType[])

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
