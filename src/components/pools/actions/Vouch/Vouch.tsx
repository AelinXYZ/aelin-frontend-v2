import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Contents as BaseContents, Title as BaseTitle } from '../Wrapper'
import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import VouchersModal from '@/src/components/pools/actions/Vouch/VouchersModal'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolSupportsMethod } from '@/src/hooks/aelin/useAelinSupportsMethod'
import useAelinVouchedPools from '@/src/hooks/aelin/vouched-pools/useAelinVouchedPools'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { useAelinPoolUpfrontDealTransaction } from '@/src/hooks/contracts/useAelinPoolUpfrontDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Container = styled(BaseCard)`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 215px;
  justify-content: center;
  padding: 30px 55px;
  gap: 10px;
`
const Title = styled(BaseTitle)`
  margin-bottom: 0;
  text-align: center;
`
const Contents = styled(BaseContents)`
  text-align: center;
  font-size: 1rem;
`
const Vouchers = styled.span`
  color: ${({ theme }) => theme.buttonPrimary.color};
`
const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 5px;
`

const VouchButton = styled(ButtonGradient)`
  width: 100%;
`

const SeeAllButton = styled(ButtonPrimaryLight)`
  width: 100%;
`

const TotalVouchers = genericSuspense(
  ({ pool }: { pool: ParsedAelinPool }) => {
    const [totalVouchers, setTotalVouchers] = useState<number>()
    const { data: aelinVouchedPools } = useAelinVouchedPools()

    useEffect(() => {
      if (
        pool &&
        aelinVouchedPools?.length &&
        aelinVouchedPools.find(({ address }) => address === pool.address)
      ) {
        setTotalVouchers(pool.totalVouchers + 1)
      } else if (pool) {
        setTotalVouchers(pool.totalVouchers)
      } else setTotalVouchers(0)
    }, [pool, aelinVouchedPools])
    return <Vouchers>{totalVouchers}</Vouchers>
  },
  () => <i>...</i>,
)

const Vouch: React.FC<{ pool: ParsedAelinPool }> = genericSuspense(({ pool }) => {
  const [showVouchersModal, setShowVouchersModal] = useState<boolean>(false)
  const { address: userAddress, appChainId } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const isUpfrontDeal = !!pool.upfrontDeal

  const supportsVouch = useAelinPoolSupportsMethod(pool, 'vouch')

  const wrongNetwork = pool.chainId !== appChainId

  const hasVouched = !!pool.vouchers?.includes(userAddress || '')

  const { estimate: vouchPoolEstimate, execute: vouchPool } = useAelinPoolTransaction(
    pool.address,
    'vouch',
  )

  const { estimate: vouchUpfrontDealEstimate, execute: vouchUpfrontDeal } =
    useAelinPoolUpfrontDealTransaction(pool.address, 'vouch')

  const { estimate: disavowPoolEstimate, execute: disavowPool } = useAelinPoolTransaction(
    pool.address,
    'disavow',
  )

  const { estimate: disavowUpfrontDealEstimate, execute: disavowUpfrontDeal } =
    useAelinPoolUpfrontDealTransaction(pool.address, 'disavow')

  const handleVouchClick = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        if (hasVouched) {
          isUpfrontDeal
            ? await disavowUpfrontDeal([], txGasOptions)
            : await disavowPool([], txGasOptions)
        } else {
          isUpfrontDeal
            ? await vouchUpfrontDeal([], txGasOptions)
            : await vouchPool([], txGasOptions)
        }
      },
      title: hasVouched ? 'Disavow Pool' : 'Vouch Pool',
      estimate: () => {
        if (hasVouched) {
          return isUpfrontDeal ? disavowUpfrontDealEstimate() : disavowPoolEstimate()
        } else {
          return isUpfrontDeal ? vouchUpfrontDealEstimate() : vouchPoolEstimate()
        }
      },
    })
  }

  const handleCloseVouchersModal = () => setShowVouchersModal(false)
  const handleOpenVouchersModal = () => setShowVouchersModal(true)

  return (
    <Container>
      {supportsVouch !== undefined ? (
        <>
          <TitleWrapper>
            <Title>Vouch for this pool</Title>
            <Tooltip text="Vouching for a pool indicates that you trust the protocol raising funds. It is recommended to vouch from ens accounts" />
          </TitleWrapper>
          <Contents>
            {supportsVouch ? (
              <>
                Total vouchers: <TotalVouchers pool={pool} />
              </>
            ) : (
              <>Vouching not supported</>
            )}
          </Contents>
          <VouchButton disabled={true} onClick={handleVouchClick}>
            {hasVouched ? 'Disavow' : 'Vouch'}
          </VouchButton>
          <SeeAllButton disabled={!supportsVouch} onClick={handleOpenVouchersModal}>
            See all vouchers
          </SeeAllButton>
          {showVouchersModal && <VouchersModal onClose={handleCloseVouchersModal} pool={pool} />}
        </>
      ) : (
        <Loading />
      )}
    </Container>
  )
})

export default genericSuspense(Vouch)
