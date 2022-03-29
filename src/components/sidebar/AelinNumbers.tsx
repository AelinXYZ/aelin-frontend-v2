import styled from 'styled-components'

const Text = styled.p`
  color: #babcc1;
  margin: 0 0 0.3em 0;
  text-align: left;
`
const Values = styled.span`
  color: #3dc0f1;
  margin-left: 1px;
`

interface Props {
  label: string
  value: number
}

const AelinNumbers: React.FC<Props> = ({ label, value }) => {
  return (
    <Text>
      {label} <Values> {value} </Values>
    </Text>
  )
}

export default AelinNumbers
