import styled from 'styled-components'

const Wrapper = styled.span`
  --height: 4px;
  --border-radius: calc(var(--height) / 2);

  background-color: ${({ theme }) => theme.progressBar.background};
  border-radius: var(--border-radius);
  display: block;
  height: var(--height);
  width: 100%;
`

const Progress = styled.span<{ progress: string }>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gradientStart} 9.37%,
    ${({ theme }) => theme.colors.gradientEnd} 100%
  );
  border-radius: var(--border-radius);
  display: block;
  height: var(--height);
  transition: width 0.2s linear;
  width: ${({ progress }) => progress}%;
`

interface Props {
  progress: string
}

export const ProgressBar: React.FC<Props> = ({ progress, ...restProps }: Props) => {
  return (
    <Wrapper {...restProps}>
      <Progress progress={progress} />
    </Wrapper>
  )
}
