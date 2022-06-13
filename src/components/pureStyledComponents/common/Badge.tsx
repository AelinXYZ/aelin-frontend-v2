import styled from 'styled-components'

export const Badge = styled.span`
  --dimensions: 16px;

  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 1rem;
  font-weight: 600;
  height: var(--dimensions);
  justify-content: center;
  line-height: 1;
  margin-top: -2px;
  min-width: var(--dimensions);
  flex-grow: 0;
`
