import styled, { keyframes } from 'styled-components'

const loadingAnimation = keyframes`
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
`

const Loading = styled.div`
  animation-delay: 0;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: ${loadingAnimation};
  animation-timing-function: ease-in-out;
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
`

export default function InlineLoading() {
  return <Loading>Loading...</Loading>
}
