import styled from 'styled-components'

import {
  ButtonNext as BaseButtonNext,
  ButtonPrev as BaseButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'

export const ButtonNext = styled(BaseButtonNext)<{ right: string; top: string }>`
  display: none;
  --dimensions: 50px;
  position: absolute;
  right: ${(props) => props.right};
  top: ${(props) => props.top};
`

export const ButtonPrev = styled(BaseButtonPrev)<{ left: string; top: string }>`
  display: none;
  --dimensions: 50px;
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
`

export const ItemsGroup = styled.div<{ centered: boolean }>`
  display: grid;
  gap: 3rem;
  grid-auto-flow: column;
  /* justify-content: ${(props) => (props.centered ? 'center' : 'flex-start')}; */
`

export const Items = styled.div`
  display: grid;
  gap: 1rem;
  grid-auto-flow: column;
  grid-auto-columns: 100%;

  padding: 0 0rem 2.5rem;

  overflow-x: auto;
  overscroll-behavior-inline: contain;

  scroll-snap-type: inline mandatory;
  scroll-padding-inline: var(3rem, 1rem);

  &::-webkit-scrollbar {
    background-color: rgba(255, 255, 255, 0.25);
    height: 0.2rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 100vw;
  }

  &::-webkit-scrollbar-track {
    border-radius: 100vw;
    margin-block: 0.5em;
  }

  & > * {
    justify-content: center;
    scroll-snap-align: start;
  }
`

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  inline-size: 100%;
  /* aspect-ratio: 16 / 9; */
  object-fit: cover;
`
export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 50px;
`

export const SectionTitle = styled.h2`
  text-align: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  line-height: 1.4;
`

export const ItemsWrapper = styled.div`
  display: flex;
  justify-content: center;
`
