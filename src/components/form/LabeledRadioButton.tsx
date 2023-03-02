import styled from 'styled-components'

import { RadioButton } from '@/src/components/pureStyledComponents/form/RadioButton'

const Wrapper = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 6px;
  align-items: center;
`

const Label = styled.span<{ checked?: boolean }>`
  color: ${({ checked, theme: { colors } }) =>
    checked ? colors.textColor : colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin-top: 1px;
  transition: color 0.15s linear;
`

export const LabeledRadioButton: React.FC<{
  checked?: boolean
  label: string
  onClick: () => void
}> = ({ checked, label, onClick, ...restProps }) => (
  <Wrapper data-cy={`radio-btn-${label.toLowerCase()}`} onClick={onClick} {...restProps}>
    <RadioButton checked={checked} />
    <Label checked={checked}>{label}</Label>
  </Wrapper>
)
