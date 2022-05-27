import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

const TooltipIconSVG = ({ ...props }) => (
  <svg fill="none" height="15" width="14" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle className="stroke" cx="7" cy="7.5" r="6.75" strokeWidth=".5" />
    <path
      className="fill"
      d="M7.102 8.156h-.666l-.018-.942c.676 0 1.014-.212 1.014-.636a.532.532 0 00-.156-.402c-.104-.1-.258-.15-.462-.15-.28 0-.558.09-.834.27v-.69c.252-.132.562-.198.93-.198.376 0 .68.098.912.294.232.196.348.464.348.804 0 .18-.036.342-.108.486a.947.947 0 01-.276.342c-.108.084-.22.148-.336.192-.116.044-.228.07-.336.078l-.012.552zm.132.918a.464.464 0 01-.474.474.476.476 0 01-.342-.132.476.476 0 01-.132-.342.464.464 0 01.474-.474c.132 0 .244.046.336.138a.457.457 0 01.138.336z"
    />
  </svg>
)

const TooltipIcon = styled(TooltipIconSVG)`
  cursor: pointer;
  outline: none;

  .stroke {
    fill: ${({ theme }) => theme.tooltip.iconBackgroundColor};
    stroke: ${({ theme }) => theme.tooltip.iconBorderColor};
  }

  .fill {
    stroke: ${({ theme }) => theme.tooltip.iconBorderColor};
  }

  &:hover {
    .fill {
      fill: ${({ theme }) => theme.colors.primary};
    }

    .stroke {
      stroke: ${({ theme }) => theme.colors.primary};
    }
  }
`

interface Props extends HTMLAttributes<HTMLSpanElement> {
  text: string
}

export const Tooltip = ({ text, ...restProps }: Props) => {
  React.useEffect(() => {
    ReactTooltip.rebuild()
  })

  return <TooltipIcon data-html={true} data-multiline={true} data-tip={text} {...restProps} />
}
