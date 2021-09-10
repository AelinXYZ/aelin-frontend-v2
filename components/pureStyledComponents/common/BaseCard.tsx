import styled, { css } from 'styled-components'

export const BaseCard = styled.div<{ backgroundOpacity?: string }>`
  background-color: rgba(
    ${(props) => props.theme.card.backgroundColor},
    ${(props) =>
      props.backgroundOpacity ? props.backgroundOpacity : props.theme.card.backgroundOpacity}
  );
  border-radius: ${({ theme }) => theme.card.borderRadius};
  padding: 25px 20px;
  position: relative;
  width: 100%;
  z-index: 5;
`

export const CenteredContentCard = styled(BaseCard)`
  display: flex;
  min-height: ${({ theme }) => theme.card.minHeightMobile};
  padding: 50px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    min-height: ${({ theme }) => theme.card.minHeightTabletLandscapeStart};
    padding: 100px 50px;
  }
`

const centeredContentCardImageLeftPosition = '170px'

export const CenteredContentCardInner = styled.div`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    margin: auto;
    max-width: fit-content;
    padding-left: ${centeredContentCardImageLeftPosition};
  }
`

export const CenteredContentCardImageCSS = css`
  margin: 40px auto 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    margin: 0;
    position: absolute;
    left: -${centeredContentCardImageLeftPosition};
    top: 5px;
  }
`

export const TopIconCard = styled(BaseCard)`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  justify-content: center;
  padding: 50px 30px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopWideStart}) {
    min-height: ${({ theme }) => theme.card.minHeightTabletLandscapeStart};
  }
`
