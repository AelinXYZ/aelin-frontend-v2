import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { getAddress, isAddress } from '@ethersproject/address'

import { genericSuspense } from '../../helpers/SafeSuspense'
import { Close } from '@/src/components/assets/Close'
import { Loading as BaseLoading } from '@/src/components/common/Loading'
import { Modal, ModalButtonCSS, ModalText, WidthLimitsCSS } from '@/src/components/common/Modal'
import {
  ButtonDropdown as BaseButtonDropdown,
  ButtonGradient,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { Textfield as BaseTextfield } from '@/src/components/pureStyledComponents/form/Textfield'
import { Token } from '@/src/constants/token'
import useAelinTokenList from '@/src/hooks/aelin/useAelinTokenList'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getERC20Data } from '@/src/utils/getERC20Data'

const ButtonDropdown = styled(BaseButtonDropdown)`
  ${WidthLimitsCSS}
`

const TextfieldWrapper = styled.div`
  margin: 0 auto 20px;
  position: relative;
  ${WidthLimitsCSS}
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
  height: 100%;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.15s linear;
  width: 36px;
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
  overflow-y: auto;

  ${WidthLimitsCSS}
`

const Item = styled.div<{ isActive: boolean }>`
  align-items: center;
  background-color: ${({ isActive, theme }) =>
    !isActive ? theme.dropdown.item.backgroundColor : theme.dropdown.item.backgroundColorHover};
  color: ${({ theme }) => theme.dropdown.item.color};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
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
const Button = styled(ButtonGradient)`
  ${ModalButtonCSS}
`

const tokenToOption = (token: Token) => ({
  value: token,
  label: token.symbol,
})

type Option = { label: string; value: Token }
type TokenDropdownProps = {
  tokenSelected?: Token
  onChange: (value: Token | undefined) => void
  placeholder: string | undefined
}

function TokenDropdown(props: TokenDropdownProps) {
  const { onChange, placeholder, tokenSelected } = props
  const { appChainId, readOnlyAppProvider } = useWeb3Connection()

  const [inputError, setInputError] = useState<string>('')
  const [searchToken, setSearchToken] = useState<string>(tokenSelected ? tokenSelected.symbol : '')
  const [searchingToken, setSearchingToken] = useState<boolean>(false)
  const [selectedToken, setSelectedToken] = useState<Option | undefined>(
    tokenSelected ? tokenToOption(tokenSelected) : undefined,
  )
  const [showModal, setShowModal] = useState(false)

  const { tokens = [], tokensByAddress } = useAelinTokenList(appChainId) || {}

  const options = useMemo(() => {
    const selectedTokenIsInList = tokens.some(
      (token) => token.address === selectedToken?.value.address,
    )

    const tokenList = [...tokens]
    if (!selectedTokenIsInList && selectedToken) {
      tokenList.push(selectedToken.value)
    }

    return tokenList
      .map(tokenToOption)
      .filter((token) => token.label.toLowerCase().includes(searchToken.toLowerCase()))
  }, [searchToken, selectedToken, tokens])

  const closeModal = () => {
    setShowModal(false)
    setInputError('')
    setSearchingToken(false)
  }

  const handlerSearchAddress = useCallback(
    async (value: string) => {
      setSearchToken(value)

      if (!isAddress(value)) {
        return
      }

      if (tokensByAddress && tokensByAddress[getAddress(value)]) {
        return setSearchToken(tokensByAddress[getAddress(value)]?.symbol || '')
      }

      setSearchingToken(true)

      let tokenData
      if (tokensByAddress && tokensByAddress[value.toLocaleLowerCase()]) {
        tokenData = tokensByAddress[value.toLocaleLowerCase()] as Token
      } else {
        tokenData = await getERC20Data({ address: value, provider: readOnlyAppProvider })
      }

      if (tokenData) {
        setInputError('')
        setSelectedToken(tokenToOption(tokenData))
        setSearchToken(tokenData.symbol)
      } else {
        setInputError('Invalid address')
      }
      return setSearchingToken(false)
    },
    [readOnlyAppProvider, tokensByAddress],
  )

  return (
    <>
      <ButtonDropdown data-cy="form-token-btn-dropdown" onClick={() => setShowModal(true)}>
        {selectedToken ? selectedToken.label : placeholder}
      </ButtonDropdown>
      {showModal && (
        <Modal onClose={closeModal} title="Select a token">
          <ModalText>Select a token from the list below or paste a custom address</ModalText>
          <TextfieldWrapper as="form">
            <Textfield
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              data-cy="from-token-modal-input"
              disabled={searchingToken}
              onChange={(e) => {
                handlerSearchAddress(e.target.value)
              }}
              placeholder={placeholder}
              type="text"
              value={searchToken}
            />
            <Delete
              onClick={() => {
                onChange(undefined)
                setInputError('')
                setSearchToken('')
                setSelectedToken(undefined)
              }}
              type="reset"
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
                    data-cy="token-selection-modal-item"
                    isActive={item.value.address === selectedToken?.value.address}
                    key={item.value.address}
                    onClick={() => {
                      setSelectedToken(item)
                      setSearchToken(item.label)
                      onChange(item.value)
                      closeModal()
                    }}
                  >
                    {item.label}
                  </Item>
                )
              })}
            {(inputError || !options.length) && !searchingToken && (
              <InvalidResults>{inputError ? inputError : 'No results'}</InvalidResults>
            )}
          </Tokens>
          <Button
            data-cy="form-token-modal-confirm-btn"
            disabled={!selectedToken || tokenSelected === selectedToken.value}
            onClick={() => {
              onChange(selectedToken?.value)
              closeModal()
            }}
          >
            Confirm
          </Button>
        </Modal>
      )}
    </>
  )
}

export default genericSuspense(TokenDropdown)
