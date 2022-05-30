import { withTheme } from 'styled-components'

import ReactTooltip from 'react-tooltip'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Component: React.FC<{ theme?: any }> = ({ theme }) => {
  return (
    <ReactTooltip
      backgroundColor={theme.tooltip.textBackgroundColor}
      border
      borderColor={theme.tooltip.textBorderColor}
      className="customTooltip"
      delayHide={250}
      delayShow={0}
      effect="solid"
      textColor={theme.tooltip.textColor}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TooltipConfig = withTheme<any>(Component)

export default TooltipConfig
