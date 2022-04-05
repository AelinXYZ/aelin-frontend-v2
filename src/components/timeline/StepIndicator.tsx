import { Step } from '@/src/components/timeline/Step'

interface Props {
  data: { title: string; isActive: boolean }[]
}

export const StepIndicator: React.FC<Props> = ({ data, ...restProps }) => {
  return (
    <div {...restProps}>
      {data.map(({ isActive, title }, index) => (
        <Step isActive={isActive} key={index}>
          {title}
        </Step>
      ))}
    </div>
  )
}
