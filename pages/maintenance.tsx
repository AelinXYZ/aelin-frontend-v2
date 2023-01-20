import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'

import env from '@/config/env'
import ThemeProvider from '@/src/providers/themeContextProvider'

const Container = styled.div`
  gap: 1.5rem;
  text-align: center;
  margin: auto;
  margin-top: 5%;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    width: 90%;
  }
`

const MaintenanceImage = styled.div<{ backgroundImage: string }>`
  min-height: 500px;
  background-repeat: no-repeat;
  margin: 0 0 20px;
  padding: 20px 20px 18px;
  justify-content: flex-end;
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-position: center;
  background-size: auto auto;

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    background-image: none;
    min-height: 50px;
  }
`

const Title = styled.h1`
  color: ${({ theme: { card } }) => card.titleColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
`
const SubTitle = styled.h3`
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.2;
`

const MAINTENANCE_MESSAGE_TITLE = env.NEXT_PUBLIC_MAINTENANCE_MESSAGE_TITLE
const MAINTENANCE_MESSAGE_SUBTITLE = env.NEXT_PUBLIC_MAINTENANCE_MESSAGE_SUBTITLE

const Maintenance: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Maintenance</title>
      </Head>
      <ThemeProvider>
        <Container>
          <MaintenanceImage backgroundImage="/resources/svg/bg-maintenance.svg" />
          <Title>{MAINTENANCE_MESSAGE_TITLE}</Title>
          <SubTitle>{MAINTENANCE_MESSAGE_SUBTITLE}</SubTitle>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default Maintenance
