import { faker } from '@faker-js/faker'

import DirectDealBuilder from '../builders/directDeal'
import CreateDirectDealPage, {
  CreateDirectDealSteps,
  DirectDealPrivacy,
} from '../pages/aelin/create-direct-deal'

describe('Direct deal life cycle', () => {
  let createDirectDealPage
  let fakeDirectDeal

  before(() => {
    createDirectDealPage = new CreateDirectDealPage()
  })

  beforeEach(() => {
    fakeDirectDeal = new DirectDealBuilder()
    createDirectDealPage.visit()
  })

  describe('Deal naming step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(fakeDirectDeal, CreateDirectDealSteps.DealNaming - 1)
    })

    it('Empty name and empty symbol', () => {
      // Assert
      createDirectDealPage.getNameInput().should('have.value', '')
      createDirectDealPage.getSymbolInput().should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: 'Deal creation',
        dealNaming: '--',
      })
    })

    it('Too long name and empty symbol', () => {
      const dealName = faker.datatype.string(31)
      createDirectDealPage.getNameInput().type(dealName, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getNameInput().should('have.value', dealName)
      createDirectDealPage.getSymbolInput().should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: dealName,
        dealNaming: [`Name: ${dealName}`, 'Symbol: '],
      })
    })

    it('Valid name and empty symbol', () => {
      const dealName = fakeDirectDeal.name
      createDirectDealPage.getNameInput().type(dealName, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getNameInput().should('have.value', dealName)
      createDirectDealPage.getSymbolInput().should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: dealName,
        dealNaming: [`Name: ${dealName}`, 'Symbol: '],
      })
    })

    it('Empty name and too long symbol', () => {
      const dealSymbol = faker.datatype.string(8)
      createDirectDealPage.getSymbolInput().type(dealSymbol, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getNameInput().should('have.value', '')
      createDirectDealPage.getSymbolInput().should('have.value', dealSymbol)
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'No more than 7 chars')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: 'Deal creation',
        dealNaming: ['Name: ', `Symbol: ${dealSymbol}`],
      })
    })

    it('Too long name and too long symbol', () => {
      const dealName = faker.datatype.string(31)
      createDirectDealPage.getNameInput().type(dealName, { parseSpecialCharSequences: false })
      const dealSymbol = faker.datatype.string(8)
      createDirectDealPage.getSymbolInput().type(dealSymbol, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getNameInput().should('have.value', dealName)
      createDirectDealPage.getSymbolInput().should('have.value', dealSymbol)
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'No more than 7 chars')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: dealName,
        dealNaming: [`Name: ${dealName}`, `Symbol: ${dealSymbol}`],
      })
    })

    it('Valid name and too long symbol', () => {
      const dealName = fakeDirectDeal.name
      createDirectDealPage.getNameInput().type(dealName, { parseSpecialCharSequences: false })
      const dealSymbol = faker.datatype.string(8)
      createDirectDealPage.getSymbolInput().type(dealSymbol, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getNameInput().should('have.value', dealName)
      createDirectDealPage.getSymbolInput().should('have.value', dealSymbol)
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'No more than 7 chars')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: dealName,
        dealNaming: [`Name: ${dealName}`, `Symbol: ${dealSymbol}`],
      })
    })

    it('Empty name and valid symbol', () => {
      const dealSymbol = fakeDirectDeal.symbol
      createDirectDealPage.getSymbolInput().type(dealSymbol, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getNameInput().should('have.value', '')
      createDirectDealPage.getSymbolInput().should('have.value', dealSymbol)
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: 'Deal creation',
        dealNaming: ['Name: ', `Symbol: ${dealSymbol}`],
      })
    })

    it('Too long name and valid symbol', () => {
      const dealName = faker.datatype.string(31)
      createDirectDealPage.getNameInput().type(dealName, { parseSpecialCharSequences: false })
      const dealSymbol = fakeDirectDeal.symbol
      createDirectDealPage.getSymbolInput().type(dealSymbol, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getNameInput().should('have.value', dealName)
      createDirectDealPage.getSymbolInput().should('have.value', dealSymbol)
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'No more than 30 chars')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: dealName,
        dealNaming: [`Name: ${dealName}`, `Symbol: ${dealSymbol}`],
      })
    })

    it('Valid name and valid symbol', () => {
      const dealName = fakeDirectDeal.name
      createDirectDealPage.getNameInput().type(dealName, { parseSpecialCharSequences: false })
      const dealSymbol = fakeDirectDeal.symbol
      createDirectDealPage.getSymbolInput().type(dealSymbol, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getNameInput().should('have.value', dealName)
      createDirectDealPage.getSymbolInput().should('have.value', dealSymbol)
      createDirectDealPage.getLeftArrowButton().should('not.exist')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealNaming, {
        title: dealName,
        dealNaming: [`Name: ${dealName}`, `Symbol: ${dealSymbol}`],
      })
    })
  })

  describe('Investment token step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(
        fakeDirectDeal,
        CreateDirectDealSteps.InvestmentToken - 1,
      )
    })

    it('Empty investment token', () => {
      // Assert
      createDirectDealPage
        .getTokenModalButton()
        .should('have.text', 'Token name or contract address...')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.InvestmentToken, {
        investmentTokenSymbol: '--',
      })
    })

    it('Valid investment token', () => {
      createDirectDealPage.getTokenModalButton().click()
      const investmentToken = fakeDirectDeal.investmentTokenSymbol
      createDirectDealPage.getTokenModalInput().type(investmentToken)
      createDirectDealPage.getTokenSelectionModalItem().click()

      // Assert
      createDirectDealPage.getTokenModalButton().should('have.text', investmentToken)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.InvestmentToken, {
        investmentTokenSymbol: investmentToken,
      })
    })
  })

  describe('Redemption deadline step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(
        fakeDirectDeal,
        CreateDirectDealSteps.RedemptionDeadline - 1,
      )
    })

    it('Empty redemption deadline', () => {
      // Assert
      createDirectDealPage.getDeadlineDuration('Days').should('have.value', '')
      createDirectDealPage.getDeadlineDuration('Hours').should('have.value', '')
      createDirectDealPage.getDeadlineDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.RedemptionDeadline, {
        redemptionDeadline: '',
      })
    })

    it('Too big redemption deadline', () => {
      const redemptionDeadlineDays = faker.datatype.number({ min: 31 })
      createDirectDealPage.getDeadlineDuration('Days').type(redemptionDeadlineDays)

      // Assert
      createDirectDealPage.getDeadlineDuration('Days').should('have.value', redemptionDeadlineDays)
      createDirectDealPage.getDeadlineDuration('Hours').should('have.value', '')
      createDirectDealPage.getDeadlineDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'Max redemption deadline is 30 days')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.RedemptionDeadline, {
        redemptionDeadline: `${redemptionDeadlineDays} days `,
      })
    })

    it('Valid redemption deadline', () => {
      const redemptionDeadlineDays = 30
      createDirectDealPage.getDeadlineDuration('Days').type(redemptionDeadlineDays)

      // Assert
      createDirectDealPage.getDeadlineDuration('Days').should('have.value', redemptionDeadlineDays)
      createDirectDealPage.getDeadlineDuration('Hours').should('have.value', '')
      createDirectDealPage.getDeadlineDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.RedemptionDeadline, {
        redemptionDeadline: `${redemptionDeadlineDays} days `,
      })
    })
  })

  describe('Sponsor fee step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(fakeDirectDeal, CreateDirectDealSteps.SponsorFee - 1)
    })

    it('No sponsor fee', () => {
      createDirectDealPage.getNoSponsorFeeLabeledCheckBox().click()
      createDirectDealPage.getSponsorFeeInput().clear()
      createDirectDealPage.getSponsorFeeInput().type(fakeDirectDeal.sponsorFee)
      createDirectDealPage.getNoSponsorFeeLabeledCheckBox().click()

      // Assert
      createDirectDealPage.getSponsorFeeInput().should('have.value', '0')
      createDirectDealPage.assertNoSponsorFeeCheckBox(true)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.SponsorFee, {
        sponsorFee: '0%',
      })
    })

    it('Zero sponsor fee', () => {
      createDirectDealPage.getNoSponsorFeeLabeledCheckBox().click()

      // Assert
      createDirectDealPage.getSponsorFeeInput().should('have.value', '0')
      createDirectDealPage.assertNoSponsorFeeCheckBox(false)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.SponsorFee, {
        sponsorFee: '--',
      })
    })

    it('Too big sponsor fee', () => {
      const sponsorFee = faker.datatype.number({ min: 16 })
      createDirectDealPage.getNoSponsorFeeLabeledCheckBox().click()
      createDirectDealPage.getSponsorFeeInput().clear()
      createDirectDealPage.getSponsorFeeInput().type(sponsorFee)

      // Assert
      createDirectDealPage.getSponsorFeeInput().should('have.value', sponsorFee)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'Must be <= 15')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.SponsorFee, {
        sponsorFee: `${sponsorFee}%`,
      })
    })

    it('Valid sponsor fee', () => {
      const sponsorFee = fakeDirectDeal.sponsorFee
      createDirectDealPage.getNoSponsorFeeLabeledCheckBox().click()
      createDirectDealPage.getSponsorFeeInput().clear()
      createDirectDealPage.getSponsorFeeInput().type(sponsorFee)

      // Assert
      createDirectDealPage.getSponsorFeeInput().should('have.value', sponsorFee)
      createDirectDealPage.assertNoSponsorFeeCheckBox(false)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.SponsorFee, {
        sponsorFee: `${sponsorFee}%`,
      })
    })
  })

  describe('Holder address step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(
        fakeDirectDeal,
        CreateDirectDealSteps.HolderAddress - 1,
      )
    })

    it('Empty holder address', () => {
      // Assert
      createDirectDealPage.getHolderAddressInput().should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.HolderAddress, {
        holderAddress: '--',
      })
    })

    it('Invalid holder address', () => {
      const holderAddress = faker.datatype.string(42)
      createDirectDealPage
        .getHolderAddressInput()
        .type(holderAddress, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage.getHolderAddressInput().should('have.value', holderAddress)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'Invalid ethereum address')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.HolderAddress, {
        holderAddress: '--',
      })
    })

    it('Valid holder address', () => {
      createDirectDealPage
        .getHolderAddressInput()
        .type(fakeDirectDeal.holderAddress, { parseSpecialCharSequences: false })

      // Assert
      createDirectDealPage
        .getHolderAddressInput()
        .should('have.value', fakeDirectDeal.holderAddress)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.HolderAddress, {
        holderAddress: `${fakeDirectDeal.holderAddress.slice(
          0,
          6,
        )}...${fakeDirectDeal.holderAddress.slice(
          fakeDirectDeal.holderAddress.length - 4,
          fakeDirectDeal.holderAddress.length,
        )}`,
      })
    })
  })

  describe('Deal token step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(fakeDirectDeal, CreateDirectDealSteps.DealToken - 1)
    })

    it('Empty deal token', () => {
      // Assert
      createDirectDealPage.getTokenModalButton().should('have.text', 'Enter deal token address...')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealToken, {
        dealTokenSymbol: '--',
      })
    })

    it('Deal token same as investment token', () => {
      createDirectDealPage.getTokenModalButton().click()
      const dealToken = fakeDirectDeal.investmentTokenSymbol
      createDirectDealPage.getTokenModalInput().type(dealToken)
      createDirectDealPage.getTokenSelectionModalItem().click()

      // Assert
      createDirectDealPage.getTokenModalButton().should('have.text', dealToken)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'The deal and investment token cannot be the same')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealToken, {
        dealTokenSymbol: dealToken,
      })
    })

    it('Deal token decimals less than investment token decimals', () => {
      createDirectDealPage.getTokenModalButton().click()
      const dealToken = 'USDC'
      createDirectDealPage.getTokenModalInput().type(dealToken)
      createDirectDealPage.getTokenSelectionModalItem().click()

      // Assert
      createDirectDealPage.getTokenModalButton().should('have.text', dealToken)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should(
          'have.text',
          'The number of decimals in the deal token must be equal or higher to the number of decimals in the investment token',
        )
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealToken, {
        dealTokenSymbol: dealToken,
      })
    })

    it('Valid deal token', () => {
      createDirectDealPage.getTokenModalButton().click()
      const dealToken = fakeDirectDeal.dealTokenSymbol
      createDirectDealPage.getTokenModalInput().type(dealToken)
      createDirectDealPage.getTokenSelectionModalItem().click()

      // Assert
      createDirectDealPage.getTokenModalButton().should('have.text', dealToken)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealToken, {
        dealTokenSymbol: dealToken,
      })
    })
  })

  describe('Deal access step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(fakeDirectDeal, CreateDirectDealSteps.DealAccess - 1)
    })

    it('Empty deal access', () => {
      // Assert
      createDirectDealPage.assertPrivacyRadioButtons(undefined)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getEditAddressesButton().should('not.exist')
      createDirectDealPage.getEditCollectionsButton().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealAccess, {
        privacy: '--',
      })
    })

    it('Public deal access', () => {
      const privacy = DirectDealPrivacy.PUBLIC
      createDirectDealPage.getPrivacyLabeledRadioButton(privacy).click()

      // Assert
      createDirectDealPage.assertPrivacyRadioButtons(privacy)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getEditAddressesButton().should('not.exist')
      createDirectDealPage.getEditCollectionsButton().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealAccess, {
        privacy: 'Public',
      })
    })

    it('Private deal access with empty allowlist', () => {
      const privacy = DirectDealPrivacy.PRIVATE
      createDirectDealPage.getPrivacyLabeledRadioButton(privacy).click()

      // Assert
      createDirectDealPage.assertPrivacyRadioButtons(privacy)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'Add addresses or change pool access to public')
      createDirectDealPage.getEditAddressesButton().should('not.be.disabled')
      createDirectDealPage.getEditCollectionsButton().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealAccess, {
        privacy: 'Private',
      })
    })

    it('Private deal access with valid allowlist', () => {
      const privacy = DirectDealPrivacy.PRIVATE
      createDirectDealPage.getPrivacyLabeledRadioButton(privacy).click()
      createDirectDealPage.getEditAddressesButton().click()
      createDirectDealPage.getAllowlistNextButton().click()
      createDirectDealPage.getFirstAllowlistAddressInput().type(fakeDirectDeal.allowlistAddress)
      createDirectDealPage.getFirstAllowlistAmountInput().type(fakeDirectDeal.allowlistAmount)
      createDirectDealPage.getAllowlistSaveButton().click()

      // Assert
      createDirectDealPage.assertPrivacyRadioButtons(privacy)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getEditAddressesButton().should('not.be.disabled')
      createDirectDealPage.getEditCollectionsButton().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealAccess, {
        privacy: 'Private',
      })
    })

    it('NFT deal access with empty collections', () => {
      const privacy = DirectDealPrivacy.NFT
      createDirectDealPage.getPrivacyLabeledRadioButton(privacy).click()

      // Assert
      createDirectDealPage.assertPrivacyRadioButtons(privacy)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'Add collections or change pool access to public')
      createDirectDealPage.getEditAddressesButton().should('not.exist')
      createDirectDealPage.getEditCollectionsButton().should('not.be.disabled')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealAccess, {
        privacy: 'Nft',
      })
    })

    it('NFT deal access with valid collections', () => {
      const privacy = DirectDealPrivacy.NFT
      createDirectDealPage.getPrivacyLabeledRadioButton(privacy).click()
      createDirectDealPage.getEditCollectionsButton().click()
      createDirectDealPage.getNftWhiteListNextButton().click()
      createDirectDealPage.getNftWhiteListNextButton().click()
      createDirectDealPage.getNftWhiteListCollectionInput().type(fakeDirectDeal.nftCollectionName)
      createDirectDealPage.getNftWhiteListCollectionItem().click()
      createDirectDealPage.getNftWhiteListNextButton().click()

      // Assert
      createDirectDealPage.assertPrivacyRadioButtons(privacy)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getEditAddressesButton().should('not.exist')
      createDirectDealPage.getEditCollectionsButton().should('not.be.disabled')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.DealAccess, {
        privacy: 'Nft',
      })
    })
  })

  describe('Exchange rates step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(
        fakeDirectDeal,
        CreateDirectDealSteps.ExchangeRates - 1,
      )
    })

    it('Empty amount to raise and empty exchange rate', () => {
      // Assert
      createDirectDealPage.getInvestmentAmountToRaiseInput().should('have.value', '')
      createDirectDealPage.getExchangeRateInput().should('have.value', '')
      createDirectDealPage.getDealTotalInfo().should('not.exist')
      createDirectDealPage.getInvestmentPerDealInfo().should('not.exist')
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: '--',
      })
    })

    it('Invalid amount to raise and empty exchange rate', () => {
      const investmentAmountToRaise = 0
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', '')
      createDirectDealPage.getDealTotalInfo().should('not.exist')
      createDirectDealPage.getInvestmentPerDealInfo().should('not.exist')
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'Set an exchange rate')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: '--',
      })
    })

    it('Valid amount to raise and empty exchange rate', () => {
      const investmentAmountToRaise = fakeDirectDeal.investmentAmountToRaise
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', '')
      createDirectDealPage.getDealTotalInfo().should('not.exist')
      createDirectDealPage.getInvestmentPerDealInfo().should('not.exist')
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'Set an exchange rate')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: '--',
      })
    })

    it('Empty amount to raise and invalid exchange rate', () => {
      const exchangeRate = 0
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)

      // Assert
      createDirectDealPage.getInvestmentAmountToRaiseInput().should('have.value', '')
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage.getDealTotalInfo().should('not.exist')
      createDirectDealPage.getInvestmentPerDealInfo().should('not.exist')
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'Set how much you want to raise')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: '--',
      })
    })

    it('Invalid amount to raise and invalid exchange rate', () => {
      const investmentAmountToRaise = 0
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)
      const exchangeRate = 0
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage.getDealTotalInfo().should('not.exist')
      createDirectDealPage.getInvestmentPerDealInfo().should('not.exist')
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'The exchange rate has to be greater than zero')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: '--',
      })
    })

    it('Valid amount to raise and invalid exchange rate', () => {
      const investmentAmountToRaise = fakeDirectDeal.investmentAmountToRaise
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)
      const exchangeRate = 0
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage.getDealTotalInfo().should('not.exist')
      createDirectDealPage.getInvestmentPerDealInfo().should('not.exist')
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'The exchange rate has to be greater than zero')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: '--',
      })
    })

    it('Empty amount to raise and valid exchange rate', () => {
      const exchangeRate = fakeDirectDeal.exchangeRate
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)

      // Assert
      createDirectDealPage.getInvestmentAmountToRaiseInput().should('have.value', '')
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage.getDealTotalInfo().should('not.exist')
      createDirectDealPage.getInvestmentPerDealInfo().should('not.exist')
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'Set how much you want to raise')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: '--',
      })
    })

    it('Invalid amount to raise and valid exchange rate', () => {
      const investmentAmountToRaise = 0
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)
      const exchangeRate = fakeDirectDeal.exchangeRate
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage.getDealTotalInfo().should('not.exist')
      createDirectDealPage.getInvestmentPerDealInfo().should('not.exist')
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should(
          'have.text',
          'The deal total has to be greater than zero, please increase amount to raise or the exchange rate',
        )
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: '--',
      })
    })

    it('Valid amount to raise and valid exchange rate', () => {
      const investmentAmountToRaise = fakeDirectDeal.investmentAmountToRaise
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)
      const exchangeRate = fakeDirectDeal.exchangeRate
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage
        .getDealTotalInfo()
        .should(
          'have.text',
          `Deal Total: ${fakeDirectDeal.investmentAmountToRaise * fakeDirectDeal.exchangeRate} ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        )
      createDirectDealPage
        .getInvestmentPerDealInfo()
        .should(
          'have.text',
          `(${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} = 1 ${fakeDirectDeal.investmentTokenSymbol})`,
        )
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: [
          `${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} per  ${fakeDirectDeal.investmentTokenSymbol}`,
          `${1 / fakeDirectDeal.exchangeRate} ${fakeDirectDeal.investmentTokenSymbol} per ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        ],
      })
    })

    it('Deal not capped', () => {
      const investmentAmountToRaise = fakeDirectDeal.investmentAmountToRaise
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)
      const exchangeRate = fakeDirectDeal.exchangeRate
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)
      createDirectDealPage.getDealCappedRadioButton(false).click()

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage
        .getDealTotalInfo()
        .should(
          'have.text',
          `Deal Total: ${fakeDirectDeal.investmentAmountToRaise * fakeDirectDeal.exchangeRate} ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        )
      createDirectDealPage
        .getInvestmentPerDealInfo()
        .should(
          'have.text',
          `(${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} = 1 ${fakeDirectDeal.investmentTokenSymbol})`,
        )
      createDirectDealPage.assertDealCappedRadioButtons(false)
      createDirectDealPage.assertDealHasMinimumRadioButtons(false)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('not.exist')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: [
          `${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} per  ${fakeDirectDeal.investmentTokenSymbol}`,
          `${1 / fakeDirectDeal.exchangeRate} ${fakeDirectDeal.investmentTokenSymbol} per ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        ],
      })
    })

    it('Empty minimum amount', () => {
      const investmentAmountToRaise = fakeDirectDeal.investmentAmountToRaise
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)
      const exchangeRate = fakeDirectDeal.exchangeRate
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)
      createDirectDealPage.getDealHasMinimumRadioButton(true).click()

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage
        .getDealTotalInfo()
        .should(
          'have.text',
          `Deal Total: ${fakeDirectDeal.investmentAmountToRaise * fakeDirectDeal.exchangeRate} ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        )
      createDirectDealPage
        .getInvestmentPerDealInfo()
        .should(
          'have.text',
          `(${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} = 1 ${fakeDirectDeal.investmentTokenSymbol})`,
        )
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(true)
      createDirectDealPage.getInvestmentMinimumAmountInput().should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage.getCurrentStepError().should('have.text', 'Invalid minimum amount')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: [
          `${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} per  ${fakeDirectDeal.investmentTokenSymbol}`,
          `${1 / fakeDirectDeal.exchangeRate} ${fakeDirectDeal.investmentTokenSymbol} per ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        ],
      })
    })

    it('Too big minimum amount', () => {
      const investmentAmountToRaise = fakeDirectDeal.investmentAmountToRaise
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)
      const exchangeRate = fakeDirectDeal.exchangeRate
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)
      createDirectDealPage.getDealHasMinimumRadioButton(true).click()
      const investmentMinimumAmount = fakeDirectDeal.investmentAmountToRaise + 1
      createDirectDealPage.getInvestmentMinimumAmountInput().type(investmentMinimumAmount)

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage
        .getDealTotalInfo()
        .should(
          'have.text',
          `Deal Total: ${fakeDirectDeal.investmentAmountToRaise * fakeDirectDeal.exchangeRate} ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        )
      createDirectDealPage
        .getInvestmentPerDealInfo()
        .should(
          'have.text',
          `(${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} = 1 ${fakeDirectDeal.investmentTokenSymbol})`,
        )
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(true)
      createDirectDealPage
        .getInvestmentMinimumAmountInput()
        .should('have.value', investmentMinimumAmount)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('be.disabled')
      createDirectDealPage.getNextButton().should('be.disabled')
      createDirectDealPage
        .getCurrentStepError()
        .should(
          'have.text',
          'The deal minimum has to be equal or less than the amount you would like to raise',
        )
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: [
          `${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} per  ${fakeDirectDeal.investmentTokenSymbol}`,
          `${1 / fakeDirectDeal.exchangeRate} ${fakeDirectDeal.investmentTokenSymbol} per ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        ],
      })
    })

    it('Valid minimum amount', () => {
      const investmentAmountToRaise = fakeDirectDeal.investmentAmountToRaise
      createDirectDealPage.getInvestmentAmountToRaiseInput().type(investmentAmountToRaise)
      const exchangeRate = fakeDirectDeal.exchangeRate
      createDirectDealPage.getExchangeRateInput().type(exchangeRate)
      createDirectDealPage.getDealHasMinimumRadioButton(true).click()
      const investmentMinimumAmount = fakeDirectDeal.investmentAmountToRaise
      createDirectDealPage.getInvestmentMinimumAmountInput().type(investmentMinimumAmount)

      // Assert
      createDirectDealPage
        .getInvestmentAmountToRaiseInput()
        .should('have.value', investmentAmountToRaise)
      createDirectDealPage.getExchangeRateInput().should('have.value', exchangeRate)
      createDirectDealPage
        .getDealTotalInfo()
        .should(
          'have.text',
          `Deal Total: ${fakeDirectDeal.investmentAmountToRaise * fakeDirectDeal.exchangeRate} ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        )
      createDirectDealPage
        .getInvestmentPerDealInfo()
        .should(
          'have.text',
          `(${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} = 1 ${fakeDirectDeal.investmentTokenSymbol})`,
        )
      createDirectDealPage.assertDealCappedRadioButtons(true)
      createDirectDealPage.assertDealHasMinimumRadioButtons(true)
      createDirectDealPage
        .getInvestmentMinimumAmountInput()
        .should('have.value', investmentMinimumAmount)
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.be.disabled')
      createDirectDealPage.getNextButton().should('not.be.disabled')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.exist')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.ExchangeRates, {
        exchangeRates: [
          `${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} per  ${fakeDirectDeal.investmentTokenSymbol}`,
          `${1 / fakeDirectDeal.exchangeRate} ${fakeDirectDeal.investmentTokenSymbol} per ${
            fakeDirectDeal.dealTokenSymbol
          }`,
        ],
      })
    })
  })

  describe('Vesting schedule step', () => {
    beforeEach(() => {
      createDirectDealPage.typeDirectDealData(
        fakeDirectDeal,
        CreateDirectDealSteps.VestingSchedule - 1,
      )
    })

    it('Empty cliff and empty period', () => {
      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: '--',
      })
    })

    it('Too big cliff and empty period', () => {
      const vestingCliff = faker.datatype.number({ min: 1825 })
      createDirectDealPage.getVestingCliffDuration('Days').type(vestingCliff)

      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', vestingCliff)
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'The vesting cliff max is 5 years or 1825 days')
      createDirectDealPage.getCreateButton().should('be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: '--',
      })
    })

    it('Valid cliff and empty period', () => {
      const vestingCliff = fakeDirectDeal.vestingCliff
      createDirectDealPage.getVestingCliffDuration('Days').type(vestingCliff)

      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', vestingCliff)
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: '--',
      })
    })

    it('Empty cliff and too big period', () => {
      const vestingPeriod = faker.datatype.number({ min: 1825 })
      createDirectDealPage.getVestingPeriodDuration('Days').type(vestingPeriod)

      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', vestingPeriod)
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'The vesting period max is 5 years or 1825 days')
      createDirectDealPage.getCreateButton().should('be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: '--',
      })
    })

    it('Too big cliff and too big period', () => {
      const vestingCliff = faker.datatype.number({ min: 1825 })
      createDirectDealPage.getVestingCliffDuration('Days').type(vestingCliff)
      const vestingPeriod = faker.datatype.number({ min: 1825 })
      createDirectDealPage.getVestingPeriodDuration('Days').type(vestingPeriod)

      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', vestingCliff)
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', vestingPeriod)
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'The vesting period max is 5 years or 1825 days')
      createDirectDealPage.getCreateButton().should('be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: [`Cliff: ${vestingCliff} days `, `Period: ${vestingPeriod} days `],
      })
    })

    it('Valid cliff and too big period', () => {
      const vestingCliff = fakeDirectDeal.vestingCliff
      createDirectDealPage.getVestingCliffDuration('Days').type(vestingCliff)
      const vestingPeriod = faker.datatype.number({ min: 1825 })
      createDirectDealPage.getVestingPeriodDuration('Days').type(vestingPeriod)

      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', vestingCliff)
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', vestingPeriod)
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'The vesting period max is 5 years or 1825 days')
      createDirectDealPage.getCreateButton().should('be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: [`Cliff: ${vestingCliff} days `, `Period: ${vestingPeriod} days `],
      })
    })

    it('Empty cliff and valid period', () => {
      const vestingPeriod = fakeDirectDeal.vestingPeriod
      createDirectDealPage.getVestingPeriodDuration('Days').type(vestingPeriod)

      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', vestingPeriod)
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: '--',
      })
    })

    it('Too big cliff and valid period', () => {
      const vestingCliff = faker.datatype.number({ min: 1825 })
      createDirectDealPage.getVestingCliffDuration('Days').type(vestingCliff)
      const vestingPeriod = fakeDirectDeal.vestingPeriod
      createDirectDealPage.getVestingPeriodDuration('Days').type(vestingPeriod)

      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', vestingCliff)
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', vestingPeriod)
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage
        .getCurrentStepError()
        .should('have.text', 'The vesting cliff max is 5 years or 1825 days')
      createDirectDealPage.getCreateButton().should('be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: [`Cliff: ${vestingCliff} days `, `Period: ${vestingPeriod} days `],
      })
    })

    it('Valid cliff and valid period', () => {
      const vestingCliff = fakeDirectDeal.vestingCliff
      createDirectDealPage.getVestingCliffDuration('Days').type(vestingCliff)
      const vestingPeriod = fakeDirectDeal.vestingPeriod
      createDirectDealPage.getVestingPeriodDuration('Days').type(vestingPeriod)

      // Assert
      createDirectDealPage.getVestingCliffDuration('Days').should('have.value', vestingCliff)
      createDirectDealPage.getVestingCliffDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingCliffDuration('Minutes').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Days').should('have.value', vestingPeriod)
      createDirectDealPage.getVestingPeriodDuration('Hours').should('have.value', '')
      createDirectDealPage.getVestingPeriodDuration('Minutes').should('have.value', '')
      createDirectDealPage.getLeftArrowButton().should('not.be.disabled')
      createDirectDealPage.getRightArrowButton().should('not.exist')
      createDirectDealPage.getNextButton().should('not.exist')
      createDirectDealPage.getCurrentStepError().should('not.exist')
      createDirectDealPage.getCreateButton().should('not.be.disabled')
      createDirectDealPage.assertDetails(fakeDirectDeal, CreateDirectDealSteps.VestingSchedule, {
        vestingSchedule: [`Cliff: ${vestingCliff} days `, `Period: ${vestingPeriod} days `],
      })
    })
  })
})
