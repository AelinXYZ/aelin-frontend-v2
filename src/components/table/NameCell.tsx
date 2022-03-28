import styled from 'styled-components'

const Wrapper = styled.span`
  align-items: center;
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  font-size: 1.4rem;
  font-weight: 500;
  gap: 10px;
  line-height: 1.2;
`

const Badge = styled.span`
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
`

export const NameCell: React.FC<{ badge?: string }> = ({ badge, children, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {children} {badge && <Badge>{badge}</Badge>}
    </Wrapper>
  )
}
