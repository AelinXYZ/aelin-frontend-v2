import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'

type WaitingForDealProps = {
  isUpfrontDeal?: boolean
}

const WaitingForDeal = ({ isUpfrontDeal }: WaitingForDealProps) => {
  return (
    <Wrapper title={isUpfrontDeal ? 'Awaiting Deal Funds' : 'Awaiting Deal'}>
      <Contents>
        {isUpfrontDeal
          ? 'The sponsor is looking for deal funds. If a deal is found, investors will be able to buy deal tokens'
          : 'The sponsor is looking for a deal. If a deal is found, investors will be able to either accept or withdraw their tokens'}
      </Contents>
    </Wrapper>
  )
}

export default WaitingForDeal
