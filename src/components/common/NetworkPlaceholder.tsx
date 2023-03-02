import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${({ theme: { networkPlaceholder } }) => networkPlaceholder.backgroundColor};
  border-radius: 50%;
  display: flex;
  height: 18px;
  justify-content: center;
  width: 18px;
`

Wrapper.defaultProps = {
  className: 'networkIcon networkPlaceholder',
}

const Name = styled.div`
  color: ${({ theme: { networkPlaceholder } }) => networkPlaceholder.color};
  font-size: 0.8rem;
  font-weight: 700;
  height: 11px;
  line-height: 1;
`

export const NetworkPlaceholder: React.FC<{ name: string }> = ({ name, ...restProps }) => (
  <Wrapper {...restProps}>
    <Name>{name}</Name>
  </Wrapper>
)
