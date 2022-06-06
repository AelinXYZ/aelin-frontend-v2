/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'

import { isAddress } from '@ethersproject/address'
import { ParseResult } from 'papaparse'
import { useCSVReader } from 'react-papaparse'

import { AddressWhitelistProps } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'

export interface IUploadCSV {
  onUploadCSV: (data: AddressWhitelistProps[]) => void
}

const UploadCSV: FC<IUploadCSV> = ({ onUploadCSV }) => {
  const { CSVReader } = useCSVReader()

  const handleOnDrop = (csv: ParseResult<string[]>) => {
    const whitelist = csv.data.reduce((accum, curr) => {
      const [address, amount] = curr

      if (!isAddress(address)) return accum

      accum.push({
        address,
        amount: Number(amount),
        isSaved: isAddress(address) && !!amount,
      })

      return accum
    }, [] as AddressWhitelistProps[])

    onUploadCSV(whitelist)
  }
  return (
    <CSVReader
      noDrag
      onUploadAccepted={(results: any) => {
        handleOnDrop(results)
      }}
    >
      {({ getRootProps }: any) => (
        <ButtonPrimaryLightSm type="button" {...getRootProps()}>
          Upload CSV
        </ButtonPrimaryLightSm>
      )}
    </CSVReader>
  )
}

export default UploadCSV
