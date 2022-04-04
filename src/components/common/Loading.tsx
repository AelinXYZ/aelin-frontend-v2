import styled from 'styled-components'

import { Spinner } from '@/src/components/assets/Spinner'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  margin: auto;
  padding: 10px;
  position: relative;
  width: 100%;
  z-index: 0;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColorLighter};
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  margin: 15px auto 0;
  text-align: center;
`

interface Props {
  text?: string
}

export const Loading: React.FC<Props> = (props) => {
  const { text, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <Spinner />
      {text && <Text>{text}</Text>}
    </Wrapper>
  )
}
