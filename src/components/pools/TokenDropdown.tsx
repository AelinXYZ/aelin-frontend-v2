import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Dropdown, DropdownItem } from '@/src/components/dropdown/Dropdown'
import { Token } from '@/src/constants/token'
import useAelinTokenList from '@/src/hooks/aelin/useAelinTokenList'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getERC20Data } from '@/src/utils/getERC20Data'

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
  tokenSelected?: Token
  onChange: (value: Token) => void
  placeholder: string | undefined
}

function TokenDropdown(props: TokenDropdownProps) {
  const { onChange, placeholder, tokenSelected } = props
  const { readOnlyAppProvider } = useWeb3Connection()

  const [customToken, setCustomToken] = useState<Token | undefined>(undefined)
  const [inputError, setInputError] = useState<string>('')
  const [searchToken, setSearchToken] = useState<string>('')
  const [searchingToken, setSearchingToken] = useState<boolean>(false)
  const [selectedToken, setSelectedToken] = useState<Option | undefined>(
    tokenSelected ? tokenToOption(tokenSelected) : undefined,
  )

  const { tokens = [] } = useAelinTokenList() || {}

  const options = useMemo(
    () =>
      !customToken
        ? tokens
            .map(tokenToOption)
            .filter((token) => token.label.toLowerCase().includes(searchToken.toLowerCase()))
        : [tokenToOption(customToken)],
    [customToken, searchToken, tokens],
  )

  const handlerSearchAddress = useCallback(
    async (value: string) => {
      if (!isAddress(value)) return setSearchToken(value)
      setSearchingToken(true)
      const tokenData = await getERC20Data({ address: value, provider: readOnlyAppProvider })
      if (tokenData) {
        setCustomToken(tokenData)
        setInputError('')
      } else {
        setInputError('Invalid address')
      }
      return setSearchingToken(false)
    },
    [readOnlyAppProvider],
  )

  useEffect(() => {
    if (selectedToken) onChange(selectedToken.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken])

  return (
    <div>
      <p>{inputError}</p>
      <Dropdown
        disabled={searchingToken}
        dropdownButtonContent={
          <DropdownButton>
            {!selectedToken ? (
              <input
                disabled={searchingToken}
                onChange={(e) => {
                  if (!e.target.value) {
                    setCustomToken(undefined)
                    setSearchToken('')
                  }
                  handlerSearchAddress(e.target.value)
                }}
                placeholder={placeholder}
                type="text"
              />
            ) : (
              <div>
                {selectedToken.label}
                <button
                  onClick={() => {
                    onChange(undefined as unknown as Token)
                    setSelectedToken(undefined)
                    setCustomToken(undefined)
                  }}
                >
                  x
                </button>
              </div>
            )}
            <ChevronDown />
          </DropdownButton>
        }
        items={
          options.length
            ? options.map((item) => {
                return (
                  <DropdownItem key={item.value.address} onClick={() => setSelectedToken(item)}>
                    {item.label}
                  </DropdownItem>
                )
              })
            : [
                <DropdownItem disabled key="no-results">
                  No results
                </DropdownItem>,
              ]
        }
      />
    </div>
  )
}

export default TokenDropdown
