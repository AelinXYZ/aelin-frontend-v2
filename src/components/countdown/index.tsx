import Countdown, { CountdownRendererFn } from 'react-countdown'

type Props = {
  date: Date
  format?: CountdownRendererFn
  onComplete?: () => void
}

export default function CountDown({ date, format, onComplete }: Props) {
  return <Countdown date={date} onComplete={onComplete} renderer={format} />
}
