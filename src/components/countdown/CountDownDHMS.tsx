import styled from 'styled-components'

import { CountdownRendererFn } from 'react-countdown'

const Wrapper = styled.div`
  margin: 0 auto 20px;
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 4.4rem;
  font-weight: 600;
  line-height: 1.2;
`

export const CountDownDHMS: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
  ...restProps
}) => {
  return (
    <Wrapper {...restProps}>
      {days}d {hours}h {minutes}m {seconds}s
    </Wrapper>
  )
}
