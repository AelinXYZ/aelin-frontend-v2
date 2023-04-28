import { useMemo } from 'react'
import styled from 'styled-components'

import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'

import OptimismDealTokenDistribution from '@/public/data/optimism-deal-token-distribution.json'
import AelinFeeDistributorABI from '@/src/abis/AelinFeeDistributorABI.json'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { Cell, Row, TableBody, TableHead } from '@/src/components/pureStyledComponents/common/Table'
import { SortableTH } from '@/src/components/table/SortableTH'
import { Chains, getNetworkConfig } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import useContractCall from '@/src/hooks/contracts/useContractCall'
import useTransaction from '@/src/hooks/contracts/useTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getDetailedNumber } from '@/src/utils/aelinPoolUtils'

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 18px;
`

const Text = styled.span`
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.2;
  color: ${({ theme: { colors } }) => colors.textColor};
`

const ClaimButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`

const ClaimButton = styled(ButtonGradient)`
  min-width: 140px;
`

const columns = {
  widths: '160px 160px 1fr 160px',
}

const tableHeaderCells = [
  {
    title: 'Deal token',
  },
  {
    title: 'Total amount',
  },
  {
    title: 'Allocated',
  },
  {
    title: 'Status',
  },
]

enum Status {
  NotEligible = 'Not eligible',
  Claimable = 'Claimable',
  Claimed = 'Claimed',
}

const HistoricalStakersDistributionList: React.FC = () => {
  const { address: userAddress, appChainId, pushNetwork } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const data = [
    { tokenName: 'vSEY', totalAmount: '7519488153057938939527000' },
    { tokenName: 'vKWENTA', totalAmount: '313372999999999999999' },
    { tokenName: 'vHECO', totalAmount: '2047430070280000000000' },
    { tokenName: 'AELIN', totalAmount: '16846242936861671899' },
  ]

  const userEntry = useMemo(() => {
    const item = OptimismDealTokenDistribution.find(
      (item) => getAddress(item[1] as string) === userAddress,
    )

    if (!item) {
      return undefined
    }

    return {
      index: item[0] as number,
      address: item[1] as string,
      amount: item[2] as string,
    }
  }, [userAddress])

  const [isClaimed, refetchIsClaimed] = useContractCall(
    new JsonRpcProvider(getNetworkConfig(appChainId).rpcUrl),
    contracts.FEE_DISTRIBUTOR.address[appChainId],
    AelinFeeDistributorABI,
    'isClaimed',
    userEntry ? [userEntry.index] : null,
  )

  const { estimate: estimateClaim, execute: executeClaim } = useTransaction(
    contracts.FEE_DISTRIBUTOR.address[appChainId],
    AelinFeeDistributorABI,
    'claim',
  )

  const status = useMemo(() => {
    if (!userEntry) {
      return Status.NotEligible
    }

    return isClaimed ? Status.Claimed : Status.Claimable
  }, [userEntry, isClaimed])

  const claimButtonHandler = () => {
    if (appChainId !== Chains.goerli && appChainId !== Chains.optimism) {
      return
    }

    const merkleTree = StandardMerkleTree.of(OptimismDealTokenDistribution, [
      'uint256',
      'address',
      'uint256',
    ])
    const merkleTreeEntry = Array.from(merkleTree.entries()).find(
      ([, [, address]]) => getAddress(address as string) === userAddress,
    )
    if (!merkleTreeEntry) {
      return
    }

    const [index, value] = merkleTreeEntry
    const proof = merkleTree.getProof(index)
    const params = [...value, proof]
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await executeClaim(params, txGasOptions)
        await refetchIsClaimed()
      },
      title: 'Claim historical stakers distribution',
      estimate: () => estimateClaim(params),
    })
  }

  return (
    <>
      {appChainId !== Chains.optimism && appChainId !== Chains.goerli && (
        <InfoContainer>
          <Text>Fees can only be claimed on Optimism network</Text>
          <ButtonPrimaryLight onClick={() => pushNetwork(Chains.optimism)}>
            Switch to Optimism
          </ButtonPrimaryLight>
        </InfoContainer>
      )}
      {(appChainId === Chains.optimism || appChainId === Chains.goerli) && (
        <>
          <TableHead columns={columns.widths}>
            {tableHeaderCells.map(({ title }, index) => (
              <SortableTH key={index}>{title}</SortableTH>
            ))}
          </TableHead>
          <TableBody>
            {data.map((item) => {
              const { tokenName, totalAmount } = item
              return (
                <Row columns={columns.widths} key={tokenName}>
                  <Cell mobileJustifyContent="center">{tokenName}</Cell>
                  <Cell mobileJustifyContent="center">
                    {getDetailedNumber(totalAmount, 18).formatted}
                  </Cell>
                  <Cell mobileJustifyContent="center">
                    {
                      getDetailedNumber(
                        BigNumber.from(userEntry ? userEntry.amount : '0')
                          .mul(
                            BigNumber.from(totalAmount).div(BigNumber.from('1000000000000000000')),
                          )
                          .toString(),
                        18,
                        18,
                      ).formatted
                    }
                  </Cell>
                  <Cell mobileJustifyContent="center">{status}</Cell>
                </Row>
              )
            })}
          </TableBody>
          <ClaimButtonContainer>
            <ClaimButton
              disabled={status !== Status.Claimable || isSubmitting}
              onClick={claimButtonHandler}
            >
              Claim
            </ClaimButton>
          </ClaimButtonContainer>
        </>
      )}
    </>
  )
}

export default HistoricalStakersDistributionList
