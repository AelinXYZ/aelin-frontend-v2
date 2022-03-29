import styled from 'styled-components'

const Wrapper = styled.div`
  color: #babcc1;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 5px 0;
`
const Value = styled.span`
  color: #3dc0f1;
`

interface Props {
  label: string
  value: number
}

const AelinDataRow: React.FC<Props> = ({ label, value, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {label} <Value>{value}</Value>
    </Wrapper>
  )
}

export default AelinDataRow
