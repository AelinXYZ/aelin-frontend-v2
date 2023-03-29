import styled from 'styled-components'

export const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 20px;
  text-align: left;
  width: 100%;
`

export const Contents = styled.div`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  text-decoration: none;
  width: 100%;
`

export const Wrapper: React.FC<{ title?: string }> = ({ children, title }) => {
  return (
    <>
      {title && <Title>{title}</Title>}
      {children}
    </>
  )
}
