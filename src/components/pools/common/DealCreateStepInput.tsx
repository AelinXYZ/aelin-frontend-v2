import { HTMLAttributes, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { LabeledCheckbox } from '@/src/components/form/LabeledCheckbox'
import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import { Description, Title } from '@/src/components/pools/common/Create'
import { HMSInput } from '@/src/components/pools/common/HMSInput'
import TokenDropdown from '@/src/components/pools/common/TokenDropdown'
import { Textfield as BaseTextField } from '@/src/components/pureStyledComponents/form/Textfield'
import { Privacy } from '@/src/constants/pool'
import {
  CreateUpFrontDealState,
  CreateUpFrontDealSteps,
  createDealConfig,
} from '@/src/hooks/aelin/useAelinCreateUpFrontDeal'

const Container = styled.div`
  padding: 10px;
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus()
    }
  }, [step])

  return (
    <Wrapper onKeyUp={onKeyUp} {...restProps}>
      {step === CreateUpFrontDealSteps.dealName ? (
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
            maxLength={8}
            min="0"
            name={step}
            onChange={(e) => setDealField(e.target.value)}
            placeholder={createDealConfig[step].placeholder?.[0]}
            ref={inputRef}
            type="number"
            value={currentState[step] as unknown as string}
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
            <br />
            <LabeledCheckbox
              checked={currentState[step]?.isCapped}
              label="Do you want the deal to be capped?"
              onClick={() => setDealField(!currentState[step]?.isCapped, `${step}.isCapped`)}
            />
            <br />
            <LabeledCheckbox
              checked={currentState[step]?.hasDealMinimum}
              label="Do you want to set a deal minimum?"
              onClick={() =>
                setDealField(!currentState[step]?.hasDealMinimum, `${step}.hasDealMinimum`)
              }
            />
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
