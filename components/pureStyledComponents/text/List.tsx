import styled from 'styled-components'

export const List = styled.ul`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  list-style: none;
  margin: 0 0 20px;
  max-width: 100%;
  padding: 0;

  &:last-child,
  &:last-of-type {
    margin-bottom: 0;
  }

  & .list {
    padding-left: 40px;
  }
`

export const ListItem = styled.li`
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 1.45;
`

ListItem.defaultProps = {
  className: 'listItem',
}
