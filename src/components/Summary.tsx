export const SummaryItem: React.FC<{
  title: string
  value: string
}> = ({ title, value }) => (
  <div>
    <div>{title}</div>
    <div>{value}</div>
  </div>
)

interface Props {
  data: { title: string; value: string }[]
}

export const Summary: React.FC<Props> = ({ data, ...restProps }) => {
  return (
    <div {...restProps}>
      {data.map((item, index) => (
        <SummaryItem key={index} {...item} />
      ))}
    </div>
  )
}
