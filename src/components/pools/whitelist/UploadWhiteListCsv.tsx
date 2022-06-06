/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'

import { ParseResult } from 'papaparse'
import { useCSVReader } from 'react-papaparse'

import { WhitelistProps } from '@/src/components/pools/whitelist/WhiteListModal'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'

export interface IUploadCSV {
  onUploadCSV: (data: WhitelistProps[]) => void
}

const UploadCSV: FC<IUploadCSV> = ({ onUploadCSV }) => {
  const { CSVReader } = useCSVReader()

  const handleOnDrop = (csv: ParseResult<string[]>) => {
    const whitelist = csv.data.reduce((accum, curr) => {
      const [address, amount] = curr

      accum.push({
        address,
        amount: Number(amount),
      })

      return accum
    }, [] as WhitelistProps[])

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
