import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Tooltip } from '../../tooltip/Tooltip'
import { LabeledCheckbox } from '@/src/components/form/LabeledCheckbox'
import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import { Description, Title } from '@/src/components/pools/common/Create'
import { HMSInput } from '@/src/components/pools/common/HMSInput'
import TokenDropdown from '@/src/components/pools/common/TokenDropdown'
import { Textfield as BaseTextField } from '@/src/components/pureStyledComponents/form/Textfield'
import { EXCHANGE_DECIMALS } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import {
  CreateUpFrontDealState,
  CreateUpFrontDealSteps,
  createDealConfig,
} from '@/src/hooks/aelin/useAelinCreateUpFrontDeal'
import { formatNumber } from '@/src/utils/formatNumber'

const Container = styled.div`
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledDescription = styled(Description)`
  margin: 20px 0;
`

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 100%;
`

const Textfield = styled(BaseTextField)`
  max-width: 100%;
  width: 320px;
`

const SponsorFeeTextfield = styled(Textfield)`
  width: 160px;
`

const PrivacyGrid = styled.div`
  display: flex;
  gap: 40px;
  margin: 0 auto;
  max-width: fit-content;
`

const ExchangeRateSummary = styled.p`
  text-align: right;
  font-size: 1.2rem;
`

const ContainerCheckbox = styled.div`
  display: flex;
  flex-direction: row;
`

const StyledLabelCheckbox = styled(LabeledCheckbox)`
  margin: 0 5px 0 0;
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  setDealField: (value: unknown, field?: string) => void
  currentState: CreateUpFrontDealState
}

const DealCreateStepInput: React.FC<Props> = ({
  currentState,
  onKeyUp,
  setDealField,
  ...restProps
}) => {
  const step = currentState.currentStep
  const inputRef = useRef<HTMLInputElement>(null)
  const [investmentPerDeal, setInvestmentPerDeal] = useState<string | null>(null)
  const [hasFee, setHasFee] = useState<boolean>(true)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus()
    }
  }, [step])

  useEffect(() => {
    if (
      currentState.currentStep !== CreateUpFrontDealSteps.exchangeRates ||
      [
        currentState[CreateUpFrontDealSteps.exchangeRates]?.exchangeRates,
        currentState[CreateUpFrontDealSteps.exchangeRates]?.investmentTokenToRaise,
      ].some(
        (val) => typeof val === undefined || val === undefined || val === '' || Number(val) === 0,
      )
    ) {
      setInvestmentPerDeal(null)
      return
    }

    const investmentPerDeal = formatNumber(
      Number(currentState[CreateUpFrontDealSteps.exchangeRates]?.investmentTokenToRaise) /
        Number(currentState[CreateUpFrontDealSteps.exchangeRates]?.exchangeRates),
      EXCHANGE_DECIMALS,
    )

    setInvestmentPerDeal(investmentPerDeal)
  }, [currentState])

  return (
    <Wrapper onKeyUp={onKeyUp} {...restProps}>
      {step === CreateUpFrontDealSteps.dealAttributes ? (
        <>
          <Container>
            <Title>Deal Name</Title>
            <StyledDescription>{createDealConfig[step].text?.[0]}</StyledDescription>
            <Textfield
              maxLength={31}
              name={step}
              onChange={(e) => setDealField(e.target.value, `${step}.name`)}
              placeholder={createDealConfig[step].placeholder?.[0]}
              ref={inputRef}
              type="text"
              value={currentState[step].name}
            />
          </Container>
          <br />
          <Container>
            <Title>Deal Symbol</Title>
            <StyledDescription>{createDealConfig[step].text?.[1]}</StyledDescription>
            <Textfield
              maxLength={8}
              name={step}
              onChange={(e) => setDealField(e.target.value, `${step}.symbol`)}
              placeholder={createDealConfig[step].placeholder?.[1]}
              ref={inputRef}
              type="text"
              value={currentState[step].symbol}
            />
          </Container>
        </>
      ) : step === CreateUpFrontDealSteps.investmentToken ? (
        <Container>
          <StyledDescription>{createDealConfig[step].text?.[0]}</StyledDescription>
          <TokenDropdown
            onChange={(token) => setDealField(token)}
            placeholder={createDealConfig[step].placeholder?.[0]}
            tokenSelected={currentState[CreateUpFrontDealSteps.investmentToken]}
          />
        </Container>
      ) : step === CreateUpFrontDealSteps.redemptionDeadline ? (
        <Container>
          <StyledDescription>{createDealConfig[step].text?.[0]}</StyledDescription>
          <HMSInput
            autofocusOnRender
            defaultValue={currentState[step]}
            onChange={(value) => setDealField(value)}
          />
        </Container>
      ) : step === CreateUpFrontDealSteps.sponsorFee ? (
        <Container>
          <StyledDescription>{createDealConfig[step].text?.[0]}</StyledDescription>
          <SponsorFeeTextfield
            disabled={!hasFee}
            maxLength={8}
            min="0"
            name={step}
            onChange={(e) => setDealField(e.target.value)}
            placeholder={createDealConfig[step].placeholder?.[0]}
            ref={inputRef}
            type="number"
            value={currentState[step] as unknown as string}
          />
          <br />
          <LabeledCheckbox
            checked={!hasFee}
            label="I don't want a fee"
            onClick={() => {
              if (hasFee) {
                setDealField('0')
              } else {
                setDealField(undefined)
              }

              setHasFee(!hasFee)
            }}
          />
        </Container>
      ) : step === CreateUpFrontDealSteps.holderAddress ? (
        <Container>
          <StyledDescription>{createDealConfig[step].text?.[0]}</StyledDescription>
          <Textfield
            maxLength={42}
            name={step}
            onChange={(e) => setDealField(e.target.value)}
            placeholder={createDealConfig[step].placeholder?.[0]}
            ref={inputRef}
            type="text"
            value={currentState[step] as unknown as string}
          />
        </Container>
      ) : step === CreateUpFrontDealSteps.dealToken ? (
        <Container>
          <StyledDescription>{createDealConfig[step].text?.[0]}</StyledDescription>
          <TokenDropdown
            onChange={(token) => setDealField(token)}
            placeholder={createDealConfig[step].placeholder?.[0]}
            tokenSelected={currentState[CreateUpFrontDealSteps.dealToken]}
          />
        </Container>
      ) : step === CreateUpFrontDealSteps.exchangeRates ? (
        <Container>
          <StyledDescription>{createDealConfig[step].text?.[0]}</StyledDescription>
          <div>
            <p>
              {`How much ${
                currentState[CreateUpFrontDealSteps.investmentToken]?.symbol
              } would you like to raise?`}
            </p>

            <Textfield
              maxLength={42}
              min="0"
              name={step}
              onChange={(e) => setDealField(e.target.value, `${step}.investmentTokenToRaise`)}
              placeholder={createDealConfig[step].placeholder?.[0]}
              ref={inputRef}
              type="number"
              value={currentState[step]?.investmentTokenToRaise}
            />
            <p>What’s the exchange rate?</p>
            <Textfield
              maxLength={42}
              min="0"
              name={step}
              onChange={(e) => setDealField(e.target.value, `${step}.exchangeRates`)}
              placeholder={createDealConfig[step].placeholder?.[1]}
              ref={inputRef}
              type="number"
              value={currentState[step]?.exchangeRates}
            />
            <br />
            {investmentPerDeal ? (
              <ExchangeRateSummary>
                ({`${investmentPerDeal} ${currentState[CreateUpFrontDealSteps.dealToken]?.symbol}`}{' '}
                = {`1 ${currentState[CreateUpFrontDealSteps.investmentToken]?.symbol}`})
              </ExchangeRateSummary>
            ) : (
              <br />
            )}
            <ContainerCheckbox>
              <StyledLabelCheckbox
                checked={currentState[step]?.isCapped}
                label="Do you want the deal to be capped?"
                onClick={() => setDealField(!currentState[step]?.isCapped, `${step}.isCapped`)}
              />
              <Tooltip
                text={`Capping the deal means that once the investment total has been reached no further deposits are allowed. By keeping the deal uncapped you may take in more investment tokens than the total and every investor will be deallocated proportionally`}
              />
            </ContainerCheckbox>
            <br />
            <ContainerCheckbox>
              <StyledLabelCheckbox
                checked={currentState[step]?.hasDealMinimum}
                label="Do you want to set a deal minimum?"
                onClick={() =>
                  setDealField(!currentState[step]?.hasDealMinimum, `${step}.hasDealMinimum`)
                }
              />
              <Tooltip
                text={`The deal will be cancelled if the minimum is not reached by the end of the deal acceptance window. Investors will be able to retrieve their investment tokens. Protocols may choose this option if they are unable to achieve their goals with an amount smaller than the minimum`}
              />
            </ContainerCheckbox>
            {currentState[step]?.hasDealMinimum && (
              <>
                <br />
                <Textfield
                  maxLength={42}
                  min="0"
                  name={step}
                  onChange={(e) => setDealField(e.target.value, `${step}.minimumAmount`)}
                  placeholder={`${createDealConfig[step].placeholder?.[2]} in ${
                    currentState[CreateUpFrontDealSteps.investmentToken]?.symbol
                  }`}
                  ref={inputRef}
                  type="number"
                  value={currentState[step]?.minimumAmount}
                />
              </>
            )}
          </div>
        </Container>
      ) : step === CreateUpFrontDealSteps.vestingSchedule ? (
        <>
          <Container>
            <Title>Vesting Cliff</Title>
            <p>
              Vesting cliff : Investors will not begin vesting any deal tokens until this point.
            </p>
            <HMSInput
              autofocusOnRender
              defaultValue={currentState[step]?.vestingCliff}
              onChange={(value) => setDealField(value, `${step}.vestingCliff`)}
            />
          </Container>
          <Container>
            <Title>Vesting Period</Title>
            <p>
              How long after the vesting cliff (if applicable), tokens will vest for. They will be
              unlocked linearly over this time.
            </p>
            <HMSInput
              autofocusOnRender
              defaultValue={currentState[step]?.vestingPeriod}
              onChange={(value) => setDealField(value, `${step}.vestingPeriod`)}
            />
          </Container>
        </>
      ) : step === CreateUpFrontDealSteps.dealPrivacy ? (
        <Container>
          <StyledDescription>{createDealConfig[step].text?.[0]}</StyledDescription>
          <PrivacyGrid>
            <LabeledRadioButton
              checked={currentState[CreateUpFrontDealSteps.dealPrivacy] === Privacy.PUBLIC}
              label={'Public'}
              onClick={() => setDealField(Privacy.PUBLIC)}
            />
            <LabeledRadioButton
              checked={currentState[CreateUpFrontDealSteps.dealPrivacy] === Privacy.PRIVATE}
              label="Private"
              onClick={() => setDealField(Privacy.PRIVATE)}
            />
            <LabeledRadioButton
              checked={currentState[CreateUpFrontDealSteps.dealPrivacy] === Privacy.NFT}
              label="NFT"
              onClick={() => setDealField(Privacy.NFT)}
            />
          </PrivacyGrid>
        </Container>
      ) : null}
    </Wrapper>
  )
}

export default DealCreateStepInput
