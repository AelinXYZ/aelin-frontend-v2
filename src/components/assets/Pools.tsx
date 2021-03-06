import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { colors } }) => colors.textColor};
  }
`

export const Pools: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`pools ${props.className}`}
    fill="none"
    height="11"
    viewBox="0 0 13 11"
    width="13"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M4.16406 2.021H12.397C12.507 2.021 12.598 1.98503 12.6699 1.91309C12.7461 1.83691 12.7842 1.74382 12.7842 1.63379C12.7842 1.51953 12.7461 1.42643 12.6699 1.35449C12.598 1.27832 12.507 1.24023 12.397 1.24023H4.16406C4.05404 1.24023 3.96094 1.27832 3.88477 1.35449C3.80859 1.42643 3.77051 1.51953 3.77051 1.63379C3.77051 1.74382 3.80859 1.83691 3.88477 1.91309C3.96094 1.98503 4.05404 2.021 4.16406 2.021ZM4.16406 5.81689H12.397C12.507 5.81689 12.598 5.77881 12.6699 5.70264C12.7461 5.62646 12.7842 5.53337 12.7842 5.42334C12.7842 5.31331 12.7461 5.22233 12.6699 5.15039C12.598 5.07422 12.507 5.03613 12.397 5.03613H4.16406C4.05404 5.03613 3.96094 5.07422 3.88477 5.15039C3.80859 5.22233 3.77051 5.31331 3.77051 5.42334C3.77051 5.53337 3.80859 5.62646 3.88477 5.70264C3.96094 5.77881 4.05404 5.81689 4.16406 5.81689ZM4.16406 9.60645H12.397C12.507 9.60645 12.598 9.57048 12.6699 9.49854C12.7461 9.42236 12.7842 9.32926 12.7842 9.21924C12.7842 9.10921 12.7461 9.01611 12.6699 8.93994C12.598 8.86377 12.507 8.82568 12.397 8.82568H4.16406C4.05404 8.82568 3.96094 8.86377 3.88477 8.93994C3.80859 9.01611 3.77051 9.10921 3.77051 9.21924C3.77051 9.32926 3.80859 9.42236 3.88477 9.49854C3.96094 9.57048 4.05404 9.60645 4.16406 9.60645ZM0.863281 2.59229L1.37744 2.21143L1.88525 2.59229C1.93604 2.63037 1.9847 2.64518 2.03125 2.63672C2.08203 2.62826 2.118 2.60498 2.13916 2.56689C2.16455 2.52458 2.16667 2.47591 2.14551 2.4209L1.94238 1.79883L2.45654 1.41797C2.50309 1.38411 2.52848 1.34391 2.53271 1.29736C2.53695 1.25081 2.52425 1.21061 2.49463 1.17676C2.46924 1.1429 2.42904 1.12598 2.37402 1.12598H1.73291L1.52344 0.46582C1.51074 0.419271 1.48324 0.387533 1.44092 0.370605C1.3986 0.353678 1.35628 0.353678 1.31396 0.370605C1.27588 0.383301 1.25049 0.415039 1.23779 0.46582L1.02197 1.12598H0.374512C0.32373 1.12598 0.283529 1.1429 0.253906 1.17676C0.224284 1.21061 0.211589 1.25081 0.21582 1.29736C0.224284 1.34391 0.249674 1.38411 0.291992 1.41797L0.806152 1.79883L0.609375 2.4209C0.588216 2.47591 0.588216 2.52458 0.609375 2.56689C0.634766 2.60498 0.670736 2.62826 0.717285 2.63672C0.763835 2.64518 0.8125 2.63037 0.863281 2.59229ZM0.863281 6.37549L1.37744 5.99463L1.88525 6.37549C1.93604 6.41357 1.9847 6.42839 2.03125 6.41992C2.08203 6.41146 2.118 6.38818 2.13916 6.3501C2.16455 6.31201 2.16667 6.26335 2.14551 6.2041L1.94238 5.58203L2.45654 5.20117C2.50309 5.16732 2.52848 5.12923 2.53271 5.08691C2.53695 5.04036 2.52425 5.00016 2.49463 4.96631C2.46924 4.93245 2.42904 4.91553 2.37402 4.91553H1.73291L1.52344 4.24902C1.51074 4.20247 1.48324 4.17074 1.44092 4.15381C1.3986 4.13688 1.35628 4.13688 1.31396 4.15381C1.27588 4.17074 1.25049 4.20247 1.23779 4.24902L1.02197 4.91553H0.374512C0.32373 4.91553 0.283529 4.93245 0.253906 4.96631C0.224284 5.00016 0.211589 5.04036 0.21582 5.08691C0.224284 5.12923 0.249674 5.16732 0.291992 5.20117L0.806152 5.58203L0.609375 6.2041C0.588216 6.26335 0.588216 6.31201 0.609375 6.3501C0.634766 6.38818 0.670736 6.41146 0.717285 6.41992C0.763835 6.42839 0.8125 6.41357 0.863281 6.37549ZM0.863281 10.1777L1.37744 9.79688L1.88525 10.1777C1.93604 10.2158 1.9847 10.2306 2.03125 10.2222C2.08203 10.2179 2.118 10.1947 2.13916 10.1523C2.16455 10.1143 2.16667 10.0656 2.14551 10.0063L1.94238 9.38428L2.45654 9.00342C2.50309 8.96956 2.52848 8.92936 2.53271 8.88281C2.53695 8.83626 2.52425 8.79818 2.49463 8.76855C2.46924 8.7347 2.42904 8.71777 2.37402 8.71777H1.73291L1.52344 8.05127C1.51074 8.00472 1.48324 7.97298 1.44092 7.95605C1.3986 7.93913 1.35628 7.93913 1.31396 7.95605C1.27588 7.97298 1.25049 8.00472 1.23779 8.05127L1.02197 8.71777H0.374512C0.32373 8.71777 0.283529 8.7347 0.253906 8.76855C0.224284 8.79818 0.211589 8.83626 0.21582 8.88281C0.224284 8.92936 0.249674 8.96956 0.291992 9.00342L0.806152 9.38428L0.609375 10.0063C0.588216 10.0656 0.588216 10.1143 0.609375 10.1523C0.634766 10.1904 0.670736 10.2137 0.717285 10.2222C0.763835 10.2306 0.8125 10.2158 0.863281 10.1777Z"
    />
  </Wrapper>
)
