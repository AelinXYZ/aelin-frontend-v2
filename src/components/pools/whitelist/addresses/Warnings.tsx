import styled from 'styled-components'

const Note = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  border-radius: 8px;
  text-align: center;
`

const ExampleRow = styled.div`
  display: flex;
  gap: 20px;
`

const ExampleAddress = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 20px 0px 10px;
  width: 340px;
  height: 36px;
  background: #282e3b;
  border: 1px solid #8280ff;
  border-radius: 8px;
`

const ExampleAmount = styled(ExampleAddress)`
  width: 140px;
`

export const Uint256Warning = () => (
  <Note>
    <div>
      If you are using an investment token with 6 decimals then <b>1.5</b> investment token is
      equivalent to <b>1500000</b>.
      <br />
      Please input the amount as a <b>uint256</b>.
    </div>
    <div>
      Example with <b>uint256</b> :
    </div>
    <ExampleRow>
      <ExampleAddress>0x0000000000000000000000000000000000000000</ExampleAddress>
      <ExampleAmount>1500000</ExampleAmount>
    </ExampleRow>
  </Note>
)

export const DecimalWarning = () => (
  <Note>
    <div>
      If you are using an investment token with 6 decimals then <b>1.5</b> investment token is
      equivalent to <b>1.5</b>.
      <br />
      Please input the amount as a <b>decimal</b>.
    </div>
    <div>
      Example with <b>decimal</b> :
    </div>
    <ExampleRow>
      <ExampleAddress>0x0000000000000000000000000000000000000000</ExampleAddress>
      <ExampleAmount>1.5</ExampleAmount>
    </ExampleRow>
  </Note>
)

export const DuplicatedAddressesWarning = () => (
  <Note>
    You can select a CSV file to input automatically the addresses and amounts.
    <br />
    Please avoid duplicate addresses in your CSV file.
  </Note>
)
