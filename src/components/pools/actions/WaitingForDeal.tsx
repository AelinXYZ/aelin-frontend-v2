import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'

type WaitingForDealProps = {
  isUpfrontDeal?: boolean
}

const WaitingForDeal = ({ isUpfrontDeal }: WaitingForDealProps) => {
  return (
    <Wrapper title={isUpfrontDeal ? 'Waiting to be funded' : 'Awaiting Deal'}>
      <Contents>
        {isUpfrontDeal
          ? 'The deal is ready but needs to be funded. Investors will be able to purchase deal tokens once funded'
          : 'The sponsor is looking for a deal. If a deal is found, investors will be able to either accept or withdraw their tokens'}
      </Contents>
    </Wrapper>
  )
}

export default WaitingForDeal
