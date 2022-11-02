import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

const TooltipIconSVG = ({ ...props }) => (
  <svg
    fill="none"
    height="15"
    viewBox="0 0 14 15"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="7" cy="7.5" fill="#282E3B" r="6.75" stroke="white" strokeWidth="0.5" />
    <path
      d="M6.91833 8.664H6.23433L6.22533 7.17C6.77733 7.17 7.20333 7.077 7.50333 6.891C7.80333 6.699 7.95333 6.414 7.95333 6.036C7.95333 5.73 7.85433 5.481 7.65633 5.289C7.45833 5.097 7.16433 5.001 6.77433 5.001C6.31233 5.001 5.84433 5.151 5.37033 5.451V4.731C5.76033 4.485 6.24033 4.362 6.81033 4.362C7.38033 4.362 7.83633 4.509 8.17833 4.803C8.52033 5.091 8.69133 5.493 8.69133 6.009C8.69133 6.519 8.51433 6.915 8.16033 7.197C7.80633 7.479 7.39533 7.641 6.92733 7.683L6.91833 8.664ZM7.10733 10.041C7.10733 10.191 7.05333 10.317 6.94533 10.419C6.84333 10.521 6.71433 10.572 6.55833 10.572C6.40833 10.572 6.28233 10.521 6.18033 10.419C6.08433 10.317 6.03633 10.191 6.03633 10.041C6.03633 9.897 6.08733 9.774 6.18933 9.672C6.29133 9.564 6.41433 9.51 6.55833 9.51C6.70833 9.51 6.83733 9.564 6.94533 9.672C7.05333 9.774 7.10733 9.897 7.10733 10.041Z"
      fill="white"
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
