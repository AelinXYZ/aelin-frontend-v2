import styled, { keyframes } from 'styled-components'

const ringAnimation = keyframes`
   0% {
     transform: rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
`
const SubRingCSS = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  border-radius: 50%;
  animation: ${ringAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`
const FirstRing = styled(SubRingCSS)`
  animation-delay: -0.45s;
`
const SecondRing = styled(SubRingCSS)`
  animation-delay: -0.3s;
`
const ThirdRing = styled(SubRingCSS)`
  animation-delay: -0.15s;
`

const MainRing = styled.div<SpinnerProps>`
  display: inline-block;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  & > * {
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    margin: ${({ margin }) => margin}px;
    border: ${({ stroke, theme: { colors } }) => `${stroke}px solid ${colors.primary}`};
    border-color: ${({ theme: { colors } }) =>
      `${colors.primary} transparent transparent transparent`};
  }
`

type SpinnerProps = {
  width?: number
  height?: number
  margin?: number
  stroke?: number
}

const SpinnerCSS = ({ height = 38, margin = 2, stroke = 4, width = 38 }: SpinnerProps) => (
  <MainRing height={height} margin={margin} stroke={stroke} width={width}>
    <FirstRing />
    <SecondRing />
    <ThirdRing />
  </MainRing>
)

export default SpinnerCSS
