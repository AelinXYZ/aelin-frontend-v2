import React, { FC } from 'react'

import { isAddress } from '@ethersproject/address'
import { ParseResult } from 'papaparse'
import { useCSVReader } from 'react-papaparse'

import { WhitelistProps } from '@/src/components/pools/whitelist/WhiteListModal'
import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'

export interface IUploadCSV {
  onUploadCSV: (data: WhitelistProps[]) => void
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
        <>
          <ButtonPrimaryLight type="button" {...getRootProps()}>
            Upload CSV
          </ButtonPrimaryLight>
        </>
      )}
    </CSVReader>
  )
}

export default UploadCSV
