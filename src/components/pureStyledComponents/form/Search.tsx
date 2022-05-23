import styled from 'styled-components'

import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'

export const Search = styled(Textfield)`
  background-color: ${({ theme }) => theme.colors.componentBackgroundColor};
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExLjg0OSAxMS4xNDFMOC40MDYgNy42OTZhNC42NTEgNC42NTEgMCAwMDEuMDg3LTIuOTljMC0yLjU5My0yLjEyNy00LjctNC43NDQtNC43UzAgMi4xMTYgMCA0LjcwOHMyLjEyNyA0LjcgNC43NDQgNC43QTQuNzU3IDQuNzU3IDAgMDA3LjY5IDguMzlsMy40NTUgMy40NTVhLjQ4NS40ODUgMCAwMC43MDQgMCAuNDg1LjQ4NSAwIDAwMC0uNzA0ek0xLjAwOSA0LjcwOGMwLTIuMDM2IDEuNjc3LTMuNjkxIDMuNzM1LTMuNjkxUzguNDggMi42NzIgOC40OCA0LjcwOGMwIDIuMDM2LTEuNjc4IDMuNjkxLTMuNzM2IDMuNjkxLTIuMDU4IDAtMy43MzYtMS42NTctMy43MzYtMy42OTF6IiBmaWxsPSIjZmZmIi8+PC9zdmc+');
  background-repeat: no-repeat;
  background-position: 20px 50%;
  padding-left: 42px;

  &:focus {
    background-color: ${({ theme }) => theme.colors.componentBackgroundColor};
  }
`

Search.defaultProps = {
  type: 'search',
}
