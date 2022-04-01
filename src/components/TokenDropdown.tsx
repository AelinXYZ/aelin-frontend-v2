import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Dropdown, DropdownItem } from '@/src/components/dropdown/Dropdown'
import { getNetworkConfig } from '@/src/constants/chains'
import { Token, validateErc20Address } from '@/src/constants/token'
import useAelinTokenList from '@/src/hooks/aelin/useAelinTokenList'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const DropdownButton = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 8px;
`

const tokenToOption = (token: Token) => ({
  value: token,
  label: token.symbol,
})

type Option = { label: string; value: Token }
type TokenDropdownProps = {
  selectedAddress?: string
  onChange: (value: Token) => void
  placeholder: string | undefined
}

function TokenDropdown(props: TokenDropdownProps) {
  const { onChange, placeholder, selectedAddress } = props
  const { current: onChangeFromProps } = useRef(onChange)

  const { readOnlyAppProvider } = useWeb3Connection()

  const [customToken, setCustomToken] = useState<Token | undefined>(undefined)
  const [inputError, setInputError] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<Option | undefined>()
  const { tokens = [], tokensByAddress = {} } = useAelinTokenList() || {}

  const hasCustomTokenSelected = customToken && selectedAddress === customToken.address

  const options = tokens.concat(customToken ? customToken : []).map(tokenToOption)

  const handlerSearchAddress = async (address: string) => {
    if (!isAddress(address)) {
      return !inputError ? setInputError('Invalid address') : null
    }
    const validationResult = await validateErc20Address(address, readOnlyAppProvider)

    if (validationResult.result === 'success') {
      setCustomToken(validationResult.token)
      setInputError('')
    } else {
      setInputError('Invalid address')
    }
  }

  useEffect(() => {
    if (selectedToken) onChangeFromProps(selectedToken.value)
  }, [onChangeFromProps, selectedToken])

  return (
    <div>
      <p>{inputError}</p>
      <Dropdown
        dropdownButtonContent={
          <DropdownButton>
            {!selectedToken ? (
              <input
                onChange={(e) =>
                  e.target.value !== null
                    ? handlerSearchAddress(e.target.value)
                    : setCustomToken(undefined)
                }
                placeholder={placeholder}
                type="text"
              />
            ) : (
              <div>
                {selectedToken.label} <button onClick={() => setSelectedToken(undefined)}>x</button>
              </div>
            )}
            <ChevronDown />
          </DropdownButton>
        }
        items={options.map((item) => {
          return (
            <DropdownItem key={item.value.address} onClick={() => setSelectedToken(item)}>
              {item.label}
            </DropdownItem>
          )
        })}
      />
      {/*<select*/}
      {/*  defaultValue={selectedAddress || ''}*/}
      {/*  id="tokenList"*/}
      {/*  name="tokenList"*/}
      {/*  onChange={(e) => onChange(e.target.value)}*/}
      {/*>*/}
      {/*  <option disabled hidden value="">*/}
      {/*    {placeholder}*/}
      {/*  </option>*/}
      {/*  {!customToken ? (*/}
      {/*    options.map((opt) => (*/}
      {/*      <option key={opt.value.address} value={opt.value}>*/}
      {/*        {opt.label}*/}
      {/*      </option>*/}
      {/*    ))*/}
      {/*  ) : (*/}
      {/*    <option key={customToken.address} value={customToken}>*/}
      {/*      {customToken.symbol}*/}
      {/*    </option>*/}
      {/*  )}*/}
      {/*</select>*/}
    </div>
  )
}

export default TokenDropdown
