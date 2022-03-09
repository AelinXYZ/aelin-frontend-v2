import styled from 'styled-components'

import { InnerContainer as BaseInnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'
import { BaseParagraph } from '@/src/components/pureStyledComponents/text/BaseParagraph'

const Wrapper = styled.footer`
  flex-shrink: 0;
  margin-top: auto;
  padding-bottom: 20px;
  padding-top: 40px;
  width: 100%;
`

const InnerContainer = styled(BaseInnerContainer)`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
`

const Paragraph = styled(BaseParagraph)`
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 0;
  order: 2;
  text-align: center;
`

export const Footer: React.FC = (props) => {
  const year = new Date().getFullYear()

  return (
    <Wrapper {...props}>
      <InnerContainer>
        <Paragraph>Copyright © {year} • BootNode.dev • All Rights Reserved</Paragraph>
      </InnerContainer>
    </Wrapper>
  )
}
