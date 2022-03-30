import styled from 'styled-components'

export const Badge = styled.span`
  --dimensions: 12px;

  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  font-size: 0.8rem;
  font-weight: 600;
  height: var(--dimensions);
  justify-content: center;
  line-height: 1;
  margin-top: -2px;
  min-width: var(--dimensions);
  flex-grow: 0;
`
