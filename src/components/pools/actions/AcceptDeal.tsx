import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'

export const AcceptDeal: React.FC = ({ ...restProps }) => (
  <Wrapper title="Awaiting Deal" {...restProps}>
    <Contents>
      The sponsor is looking for a deal. If a deal is found, investors will be able to either accept
      or withdraw their tokens
    </Contents>
  </Wrapper>
)

export default AcceptDeal
