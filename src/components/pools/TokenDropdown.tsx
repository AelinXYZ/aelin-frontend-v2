import { useCallback, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { Close } from '@/src/components/assets/Close'
import { Loading as BaseLoading } from '@/src/components/common/Loading'
import { Modal } from '@/src/components/common/Modal'
import { ButtonDropdown as BaseButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { Textfield as BaseTextfield } from '@/src/components/pureStyledComponents/form/Textfield'
import { Token } from '@/src/constants/token'
import useAelinTokenList from '@/src/hooks/aelin/useAelinTokenList'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getERC20Data } from '@/src/utils/getERC20Data'

const WidthCSS = css`
  max-width: 100%;
  width: 320px;
`

const ButtonDropdown = styled(BaseButtonDropdown)`
  ${WidthCSS}
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 auto 20px;
  text-align: center;
  ${WidthCSS}
`

const TextfieldWrapper = styled.div`
  margin: 0 auto 20px;
  position: relative;
  ${WidthCSS}
`

const Textfield = styled(BaseTextfield)`
  overflow: hidden;
  padding-right: 40px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 5;
`

const Delete = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  height: ${({ theme }) => theme.textField.height};
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.15s linear;
  width: ${({ theme }) => theme.textField.height};
  z-index: 10;

  &:active {
    opacity: 0.7;
  }
`

const Tokens = styled.div`
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  display: flex;
  flex-direction: column;
  height: 300px;
  margin: 0 auto 30px;
  overflow: hidden;
  ${WidthCSS}
`

const Item = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.dropdown.item.backgroundColor};
  color: ${({ theme }) => theme.dropdown.item.color};
  cursor: pointer;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  gap: 10px;
  line-height: 1.4;
  min-height: ${({ theme }) => theme.dropdown.item.height};
  overflow: hidden;
  padding: 15px ${({ theme }) => theme.dropdown.item.paddingHorizontal};
  text-decoration: none;
  transition: background-color 0.15s linear;
  user-select: none;
  width: 100%;

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.dropdown.item.backgroundColorHover};
  }

  &:active {
    opacity: 0.7;
  }
`

const InvalidResults = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  font-size: 1.5rem;
  font-weight: 600;
  height: 100%;
  justify-content: center;
  line-height: 1.4;
  text-align: center;
  width: 100%;
`

const Loading = styled(BaseLoading)`
  margin: auto;
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
      if (!isAddress(value)) {
        return setSearchToken(value)
      }

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

  const [showModal, setShowModal] = useState(false)

  const closeModal = () => {
    setShowModal(false)
    setInputError('')
    setSearchToken('')
    setSearchingToken(false)
    setCustomToken(undefined)
  }

  return (
    <>
      <ButtonDropdown onClick={() => setShowModal(true)}>
        {selectedToken ? selectedToken.label : placeholder}
      </ButtonDropdown>
      {showModal && (
        <Modal onClose={closeModal} title="Select a token">
          <Description>
            Address of any ERC-20 tokens investors will contribute to the pool. Or choose from some
            of the commonly used tokens already provided in the below list.
          </Description>
          <TextfieldWrapper>
            <Textfield
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
            <Delete
              onClick={() => {
                onChange(undefined as unknown as Token)
                setCustomToken(undefined)
                setInputError('')
                setSearchToken('')
              }}
            >
              <Close />
            </Delete>
          </TextfieldWrapper>
          <Tokens>
            {searchingToken && <Loading />}
            {!searchingToken &&
              options.map((item) => {
                return (
                  <Item
                    key={item.value.address}
                    onClick={() => {
                      setSelectedToken(item)
                      closeModal()
                    }}
                  >
                    {item.label}
                  </Item>
                )
              })}
            {(inputError || !options.length) && (
              <InvalidResults>{inputError ? inputError : 'No results'}</InvalidResults>
            )}
          </Tokens>
        </Modal>
      )}
    </>
  )
}

export default TokenDropdown
