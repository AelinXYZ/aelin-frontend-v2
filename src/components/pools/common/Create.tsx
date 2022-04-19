import styled from 'styled-components'

export const WrapperGrid = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  width: 100%;
`

export const StepContents = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

export const PrevNextWrapper = styled.div`
  padding-top: 150px;
`

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 18px;
  max-width: 100%;
  padding: 0 20px;
  text-align: center;
  width: 690px;
`

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 50px;
  max-width: 100%;
  padding: 0 20px;
  text-align: center;
  width: 690px;
`

export const ButtonWrapper = styled.div`
  margin-bottom: 40px;
  margin-top: 40px;
`
