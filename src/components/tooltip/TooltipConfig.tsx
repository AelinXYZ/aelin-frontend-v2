import ReactTooltip from 'react-tooltip'

export default function TooltipConfig() {
  return (
    <ReactTooltip
      backgroundColor="#282E3B"
      border
      borderColor="#fff"
      className="customTooltip"
      delayHide={250}
      delayShow={0}
      effect="solid"
      textColor="#fff"
    />
  )
}
