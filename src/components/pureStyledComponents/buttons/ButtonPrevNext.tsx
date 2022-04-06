import styled from 'styled-components'

const Wrapper = styled.button`
  --dimensions: 30px;

  background-color: ${({ theme: { colors } }) => colors.gray};
  background-position: 50% 50%;
  background-repeat: no-repeat;
  border-radius: 50%;
  cursor: pointer;
  height: var(--dimensions);
  transition: background-color linear 0.15s;
  width: var(--dimensions);
  padding: 0;
  border: none;

  &:hover {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
  }

  &:active {
    opacity: 0.7;
  }

  &[disabled] {
    &,
    &:hover {
      background-color: ${({ theme: { colors } }) => colors.gray};
      box-shadow: none;
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`

export const ButtonPrev = styled(Wrapper)`
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLjk0NyA1Ljk3NWMwIC4yMjQuMDgzLjQxLjI2NC41ODZsNC44OTMgNC43MzZhLjcxMi43MTIgMCAwMC41MTcuMjE1LjczNS43MzUgMCAwMC43NDItLjczOGMwLS4yMS0uMDgzLS4zOS0uMjMtLjUzN0wyLjcxIDUuOTdsNC40MjQtNC4yNjNBLjczNS43MzUgMCAwMDYuNjIuNDM3YS43LjcgMCAwMC0uNTE3LjIxTDEuMjEgNS4zOWMtLjE4LjE3NS0uMjY0LjM1Ni0uMjY0LjU4NnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=');
`
export const ButtonNext = styled(Wrapper)`
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNy4wNTMgNi4wMjVjMC0uMjI0LS4wODMtLjQxLS4yNjQtLjU4NkwxLjg5Ni43MDNBLjcxMi43MTIgMCAwMDEuMzguNDg4YS43MzUuNzM1IDAgMDAtLjc0Mi43MzhjMCAuMjEuMDgzLjM5LjIzLjUzN0w1LjI5IDYuMDMuODY2IDEwLjI5M2EuNzM1LjczNSAwIDAwLjUxMyAxLjI3LjcuNyAwIDAwLjUxNy0uMjFMNi43OSA2LjYxYy4xOC0uMTc1LjI2NC0uMzU2LjI2NC0uNTg2eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==');
`
