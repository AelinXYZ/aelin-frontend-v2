import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'

const WaitingForDeal: React.FC = () => {
  return (
    <Wrapper title="Awaiting Deal">
      <Contents>
        The sponsor is looking for a deal. If a deal is found, investors will be able to either
        accept or withdraw their tokens
      </Contents>
    </Wrapper>
  )
}

export default WaitingForDeal
