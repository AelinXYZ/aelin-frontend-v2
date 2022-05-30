import styled from 'styled-components'

export const Checkbox = styled.div<{ checked?: boolean }>`
  --dimensions: 14px;

  background-color: ${({ checked, theme: { colors } }) =>
    checked ? colors.primary : 'rgba(255, 255, 255, 0.04)'};
  border-color: ${({ theme: { checkBox } }) => checkBox.borderColor};
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--dimensions);
  transition: all 0.15s linear;
  width: var(--dimensions);
`
