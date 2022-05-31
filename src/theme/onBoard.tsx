import { css } from 'styled-components'

export const onBoardCSS = css`
  .bn-onboard-custom {
    &.bn-onboard-modal {
      background-color: ${({ theme }) => theme.modal.overlayBackgroundColor};
      z-index: 50;

      .bn-onboard-custom {
        &.bn-onboard-modal-content {
          background-color: ${({ theme }) => theme.colors.componentBackgroundColor};
          color: ${({ theme }) => theme.colors.textColor};

          a {
            color: ${({ theme }) => theme.colors.primary}!important;
          }
        }

        &.bn-onboard-dark-mode-link {
          color: ${({ theme }) => theme.colors.primary};
          border-color: ${({ theme }) => theme.colors.primary};
        }

        &.bn-onboard-select-wallet-info {
          color: ${({ theme }) => theme.colors.primary};
        }

        &.bn-onboard-modal-content-header-icon {
          background: none;
        }

        &.bn-onboard-icon-button {
          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }
    }
  }
`
