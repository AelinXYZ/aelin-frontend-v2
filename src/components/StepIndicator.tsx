export const StepIndicatorItem: React.FC<{
  title: string
  isActive: boolean
}> = ({ isActive, title }) => (
  <div
    className={isActive ? 'active' : undefined}
    style={{ color: isActive ? 'green' : 'inherit' }}
  >
    <div>{title}</div>
  </div>
)

interface Props {
  data: { title: string; isActive: boolean }[]
}

export const StepIndicator: React.FC<Props> = ({ data, ...restProps }) => {
  return (
    <div {...restProps}>
      {data.map((item, index) => (
        <StepIndicatorItem key={index} {...item} />
      ))}
    </div>
  )
}
