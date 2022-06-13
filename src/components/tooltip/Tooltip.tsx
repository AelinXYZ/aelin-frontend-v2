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
      d="M7.10184 8.156H6.43584L6.41784 7.214C7.09384 7.214 7.43184 7.002 7.43184 6.578C7.43184 6.41 7.37984 6.276 7.27584 6.176C7.17184 6.076 7.01784 6.026 6.81384 6.026C6.53384 6.026 6.25584 6.116 5.97984 6.296V5.606C6.23184 5.474 6.54184 5.408 6.90984 5.408C7.28584 5.408 7.58984 5.506 7.82184 5.702C8.05384 5.898 8.16984 6.166 8.16984 6.506C8.16984 6.686 8.13384 6.848 8.06184 6.992C7.98984 7.136 7.89784 7.25 7.78584 7.334C7.67784 7.418 7.56584 7.482 7.44984 7.526C7.33384 7.57 7.22184 7.596 7.11384 7.604L7.10184 8.156ZM7.23384 9.074C7.23384 9.21 7.18784 9.324 7.09584 9.416C7.00384 9.504 6.89184 9.548 6.75984 9.548C6.62384 9.548 6.50984 9.504 6.41784 9.416C6.32984 9.324 6.28584 9.21 6.28584 9.074C6.28584 8.942 6.32984 8.83 6.41784 8.738C6.50984 8.646 6.62384 8.6 6.75984 8.6C6.89184 8.6 7.00384 8.646 7.09584 8.738C7.18784 8.83 7.23384 8.942 7.23384 9.074Z"
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
