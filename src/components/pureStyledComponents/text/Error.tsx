import styled from 'styled-components'

export const Error = styled.p<{ align?: AlignSetting }>`
  color: ${({ theme }) => theme.colors.error};
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 1.2;
  margin: 10px auto 20px;
  max-width: 100%;
  text-align: ${({ align }) => align || 'left'};
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`
