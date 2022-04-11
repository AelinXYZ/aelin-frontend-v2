import styled from 'styled-components'

export const RadioButton = styled.div<{ checked?: boolean }>`
  --dimensions: 14px;

  background-color: ${({ checked }) => (checked ? '#fff' : 'rgba(255, 255, 255, 0.04)')};
  border-color: ${({ checked, theme: { colors } }) =>
    checked ? colors.primary : colors.componentBorderColor};
  border-radius: 50%;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--dimensions);
  transition: all 0.15s linear;
  width: var(--dimensions);
`
