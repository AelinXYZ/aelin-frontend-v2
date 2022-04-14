import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 0 auto 30px;
  max-width: 100%;
  width: ${({ theme }) => theme.layout.maxWidth};
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 12px;
  padding: 20px 0 0 0;
`

const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.3;
  margin: 0;
`

export const PageTitle: React.FC<{ title: string; subTitle?: string }> = ({
  subTitle,
  title,
  ...restProps
}) => (
  <Wrapper {...restProps}>
    <Title>{title}</Title>
    <SubTitle>{subTitle ? subTitle : '--'}</SubTitle>
  </Wrapper>
)
