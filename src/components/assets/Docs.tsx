import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: #4285fd;
  }
`

export const Docs: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`docs ${props.className}`}
    fill="none"
    height="14"
    viewBox="0 0 20 14"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M8.91522 11.8029C9.26601 11.8029 9.47648 12.0775 9.47648 12.3522C9.47648 12.6955 9.19585 12.9014 8.91522 12.9014C8.56444 12.9014 8.35397 12.6268 8.35397 12.3522C8.35397 12.0775 8.56444 11.8029 8.91522 11.8029ZM18.1058 8.30122C17.755 8.30122 17.5445 8.02658 17.5445 7.75193C17.5445 7.47729 17.8251 7.20265 18.1058 7.20265C18.4566 7.20265 18.667 7.47729 18.667 7.75193C18.667 8.02658 18.3864 8.30122 18.1058 8.30122ZM18.1058 5.96677C17.1236 5.96677 16.2817 6.79069 16.2817 7.75193C16.2817 7.95791 16.2817 8.1639 16.3518 8.30122L10.3885 11.3909C10.0377 10.9103 9.47648 10.6357 8.91522 10.6357C8.21365 10.6357 7.58224 11.0476 7.30162 11.5969L1.9697 8.8505C1.40844 8.57586 0.987502 7.61461 1.05766 6.79069C1.05766 6.37873 1.26813 6.03543 1.4786 5.89811C1.61891 5.82945 1.82938 5.82945 1.9697 5.89811H2.03985C3.44299 6.65337 8.1435 8.98782 8.28381 9.12514C8.56444 9.26246 8.77491 9.33112 9.26601 9.05648L18.8775 4.18161C19.0178 4.11295 19.1581 3.97563 19.1581 3.76965C19.1581 3.49501 18.8775 3.35769 18.8775 3.35769C18.3162 3.08305 17.4744 2.73975 16.7026 2.32779C14.9487 1.50387 12.9843 0.611289 12.0723 0.199328C11.3006 -0.212632 10.7393 0.130668 10.599 0.199328L10.3885 0.267989C6.45973 2.19047 1.19797 4.73089 0.917345 4.86821C0.35609 5.21151 0.0754633 5.82945 0.00530645 6.58471C-0.0648504 7.8206 0.566561 9.12513 1.54876 9.60575L7.23146 12.4895C7.37177 13.3821 8.1435 14 8.98538 14C9.96758 14 10.8095 13.2447 10.8095 12.2835L17.0534 8.98782C17.4042 9.26246 17.755 9.33112 18.1759 9.33112C19.1581 9.33112 20 8.5072 20 7.54595C19.8597 6.72203 19.088 5.96677 18.1058 5.96677Z"
    />
  </Wrapper>
)
