import { faker } from '@faker-js/faker'

import PoolBuilder from '../builders/poolStepper'
import CreatePoolPage, { CreatePoolSteps, PoolPrivacy } from '../pages/aelin/create-pool'

describe('Complete Pool life cycle', () => {
  let createPoolPage
  // let header
  let fakePool

  before(() => {
    cy.addMetamaskNetwork({
      networkName: 'Goerli-local',
      rpcUrl: Cypress.env('anvil'),
      chainId: '5',
      symbol: 'GETH',
      isTestnet: true,
    })

    createPoolPage = new CreatePoolPage()
  })

  beforeEach(() => {
    fakePool = new PoolBuilder()
    createPoolPage.visit()
    // TODO: Not sure if we need to login for these tests
    // createPoolPage.login()
  })

  describe('Create Pool Stepper (public pool)', () => {
    it('Should type all data and show it correctly in the summary and create Pool', () => {
      createPoolPage.typePoolData(fakePool)

      // Check Timeline
      createPoolPage.getActiveTimeLineStepTitle().should('have.text', 'Pool Creation')

      // Assert
      createPoolPage.getTitle().should('have.text', fakePool.name)
      createPoolPage.getSummaryItem('pool-name').should('have.text', fakePool.name)
      createPoolPage.getSummaryItem('pool-symbol').should('have.text', fakePool.symbol)

      // Find a better way to assert creation dates
      // createPoolPage
      //   .getSummaryItem('investment-deadline')
      //   .invoke('text')
      //   .should('match', fakePool.toRegexDate(fakePool.getInvestmentDeadlineDuration()))
      // createPoolPage
      //   .getSummaryItem('deal-deadline')
      //   .invoke('text')
      //   .should('match', fakePool.toRegexDate(fakePool.getDealDeadlineDuration()))

      createPoolPage.getSummaryItem('pool-cap').should('have.text', fakePool.poolCap)
      createPoolPage.getSummaryItem('sponsor-fee').should('have.text', fakePool.sponsorFee + '%')
      createPoolPage.getSummaryItem('pool-access').should('have.text', 'Public')
      createPoolPage.getSummaryInvestmentToken().should('have.text', fakePool.purchaseTokenSymbol)
    })
  })

  describe('Pool name step', () => {
    beforeEach(() => {
      createPoolPage.typePoolData(fakePool, CreatePoolSteps.PoolName - 1)
    })

    it('Empty pool name', () => {
      // Assert
      createPoolPage.getNameInput().should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.exist')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Too long pool name', () => {
      const poolName = faker.datatype.string(32)
      createPoolPage.getNameInput().type(poolName, { parseSpecialCharSequences: false })

      // Assert
      createPoolPage.getNameInput().should('have.value', poolName.slice(0, 31))
      createPoolPage.getLeftArrowButton().should('not.exist')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('have.text', 'No more than 30 chars')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Valid pool name', () => {
      const poolName = faker.datatype.string(30)
      createPoolPage.getNameInput().type(poolName, { parseSpecialCharSequences: false })

      // Assert
      createPoolPage.getNameInput().should('have.value', poolName)
      createPoolPage.getLeftArrowButton().should('not.exist')
      createPoolPage.getRightArrowButton().should('not.be.disabled')
      createPoolPage.getNextButton().should('not.be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })
  })

  describe('Pool symbol step', () => {
    beforeEach(() => {
      createPoolPage.typePoolData(fakePool, CreatePoolSteps.PoolSymbol - 1)
    })

    it('Empty pool symbol', () => {
      // Assert
      createPoolPage.getSymbolInput().should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Too long pool symbol', () => {
      const poolSymbol = faker.datatype.string(9)
      createPoolPage.getSymbolInput().type(poolSymbol, { parseSpecialCharSequences: false })

      // Assert
      createPoolPage.getSymbolInput().should('have.value', poolSymbol.slice(0, 8))
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('have.text', 'No more than 7 chars')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Valid pool symbol', () => {
      const poolSymbol = faker.datatype.string(7)
      createPoolPage.getSymbolInput().type(poolSymbol, { parseSpecialCharSequences: false })

      // Assert
      createPoolPage.getSymbolInput().should('have.value', poolSymbol)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.be.disabled')
      createPoolPage.getNextButton().should('not.be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })
  })

  describe('Investment token step', () => {
    beforeEach(() => {
      createPoolPage.typePoolData(fakePool, CreatePoolSteps.InvestmentToken - 1)
    })

    it('Empty investment token', () => {
      // Assert
      createPoolPage
        .getInvestmentTokenModalButton()
        .should('have.text', 'Token name or contract address...')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Valid investment token', () => {
      createPoolPage.getInvestmentTokenModalButton().click()
      const investmentToken = fakePool.purchaseTokenSymbol
      createPoolPage.getInvestmentTokenModalInput().type(investmentToken)
      createPoolPage.getTokenSelectionModalItem().click()

      // Assert
      createPoolPage.getInvestmentTokenModalButton().should('have.text', investmentToken)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.be.disabled')
      createPoolPage.getNextButton().should('not.be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })
  })

  describe('Investment deadline step', () => {
    beforeEach(() => {
      createPoolPage.typePoolData(fakePool, CreatePoolSteps.InvestmentDeadLine - 1)
    })

    it('Empty investment deadline', () => {
      // Assert
      createPoolPage.getDeadlineDuration('Days').should('have.value', '')
      createPoolPage.getDeadlineDuration('Hours').should('have.value', '')
      createPoolPage.getDeadlineDuration('Minutes').should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Too big investment deadline', () => {
      const investmentDeadlineDays = faker.datatype.number({ min: 31 })
      createPoolPage.getDeadlineDuration('Days').type(investmentDeadlineDays)

      // Assert
      createPoolPage.getDeadlineDuration('Days').should('have.value', investmentDeadlineDays)
      createPoolPage.getDeadlineDuration('Hours').should('have.value', '')
      createPoolPage.getDeadlineDuration('Minutes').should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('have.text', 'Max purchase expiry is 30 days')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Valid investment deadline', () => {
      const investmentDeadlineDays = 30
      createPoolPage.getDeadlineDuration('Days').type(investmentDeadlineDays)

      // Assert
      createPoolPage.getDeadlineDuration('Days').should('have.value', investmentDeadlineDays)
      createPoolPage.getDeadlineDuration('Hours').should('have.value', '')
      createPoolPage.getDeadlineDuration('Minutes').should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.be.disabled')
      createPoolPage.getNextButton().should('not.be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })
  })

  describe('Deal deadline step', () => {
    beforeEach(() => {
      createPoolPage.typePoolData(fakePool, CreatePoolSteps.DealDeadline - 1)
    })

    it('Empty deal deadline', () => {
      // Assert
      createPoolPage.getDeadlineDuration('Days').should('have.value', '')
      createPoolPage.getDeadlineDuration('Hours').should('have.value', '')
      createPoolPage.getDeadlineDuration('Minutes').should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Too big deal deadline', () => {
      const dealDeadlineDays = faker.datatype.number({ min: 366 })
      createPoolPage.getDeadlineDuration('Days').type(dealDeadlineDays)

      // Assert
      createPoolPage.getDeadlineDuration('Days').should('have.value', dealDeadlineDays)
      createPoolPage.getDeadlineDuration('Hours').should('have.value', '')
      createPoolPage.getDeadlineDuration('Minutes').should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('have.text', 'Max duration is 365 days')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Valid deal deadline', () => {
      const dealDeadlineDays = 365
      createPoolPage.getDeadlineDuration('Days').type(dealDeadlineDays)

      // Assert
      createPoolPage.getDeadlineDuration('Days').should('have.value', dealDeadlineDays)
      createPoolPage.getDeadlineDuration('Hours').should('have.value', '')
      createPoolPage.getDeadlineDuration('Minutes').should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.be.disabled')
      createPoolPage.getNextButton().should('not.be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })
  })

  describe('Pool cap step', () => {
    beforeEach(() => {
      createPoolPage.typePoolData(fakePool, CreatePoolSteps.PoolCap - 1)
    })

    it('No cap', () => {
      createPoolPage.getNoCapLabeledCheckBox().click()
      createPoolPage.getNoCapInput().type(fakePool.poolCap)
      createPoolPage.getNoCapLabeledCheckBox().click()

      // Assert
      createPoolPage.getNoCapInput().should('have.value', '0')
      createPoolPage.assertNoCapCheckBox(true)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.be.disabled')
      createPoolPage.getNextButton().should('not.be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Empty cap', () => {
      createPoolPage.getNoCapLabeledCheckBox().click()

      // Assert
      createPoolPage.getNoCapInput().should('have.value', '')
      createPoolPage.assertNoCapCheckBox(false)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Valid cap', () => {
      createPoolPage.getNoCapLabeledCheckBox().click()
      createPoolPage.getNoCapInput().type(fakePool.poolCap)

      // Assert
      createPoolPage.getNoCapInput().should('have.value', fakePool.poolCap)
      createPoolPage.assertNoCapCheckBox(false)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.be.disabled')
      createPoolPage.getNextButton().should('not.be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })
  })

  describe('Sponsor fee step', () => {
    beforeEach(() => {
      createPoolPage.typePoolData(fakePool, CreatePoolSteps.SponsorFee - 1)
    })

    it('Empty sponsor fee', () => {
      // Assert
      createPoolPage.getSponsorFeeInput().should('have.value', '')
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Too big sponsor fee', () => {
      const sponsorFee = faker.datatype.number({ min: 16 })
      createPoolPage.getSponsorFeeInput().type(sponsorFee)

      // Assert
      createPoolPage.getSponsorFeeInput().should('have.value', sponsorFee)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('be.disabled')
      createPoolPage.getNextButton().should('be.disabled')
      createPoolPage.getCurrentStepError().should('have.text', 'Must be <= 15')
      createPoolPage.getCreateButton().should('not.exist')
    })

    it('Valid sponsor fee', () => {
      const sponsorFee = 15
      createPoolPage.getSponsorFeeInput().type(sponsorFee)

      // Assert
      createPoolPage.getSponsorFeeInput().should('have.value', sponsorFee)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.be.disabled')
      createPoolPage.getNextButton().should('not.be.disabled')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getCreateButton().should('not.exist')
    })
  })

  describe('Pool privacy step', () => {
    beforeEach(() => {
      createPoolPage.typePoolData(fakePool, CreatePoolSteps.PoolPrivacy - 1)
    })

    it('Empty pool privacy', () => {
      // Assert
      createPoolPage.assertPrivacyRadioButtons(undefined)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.exist')
      createPoolPage.getNextButton().should('not.exist')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getEditAddressesButton().should('not.exist')
      createPoolPage.getEditCollectionsButton().should('not.exist')
      createPoolPage.getCreateButton().should('be.disabled')
    })

    it('Public pool privacy', () => {
      createPoolPage.getPrivacyLabeledRadioButton(PoolPrivacy.PUBLIC).click()

      // Assert
      createPoolPage.assertPrivacyRadioButtons(PoolPrivacy.PUBLIC)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.exist')
      createPoolPage.getNextButton().should('not.exist')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getEditAddressesButton().should('not.exist')
      createPoolPage.getEditCollectionsButton().should('not.exist')
      createPoolPage.getCreateButton().should('not.be.disabled')
    })

    it('Private pool privacy with empty allowlist', () => {
      createPoolPage.getPrivacyLabeledRadioButton(PoolPrivacy.PRIVATE).click()

      // Assert
      createPoolPage.assertPrivacyRadioButtons(PoolPrivacy.PRIVATE)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.exist')
      createPoolPage.getNextButton().should('not.exist')
      createPoolPage
        .getCurrentStepError()
        .should('have.text', 'Add addresses or change pool access to public')
      createPoolPage.getEditAddressesButton().should('not.be.disabled')
      createPoolPage.getEditCollectionsButton().should('not.exist')
      createPoolPage.getCreateButton().should('be.disabled')
    })

    it('Private pool privacy with valid allowlist', () => {
      createPoolPage.getPrivacyLabeledRadioButton(PoolPrivacy.PRIVATE).click()
      createPoolPage.getEditAddressesButton().click()
      createPoolPage.getAllowlistNextButton().click()
      createPoolPage.getFirstAllowlistAddressInput().type(fakePool.allowlistAddress)
      createPoolPage.getFirstAllowlistAmountInput().type(fakePool.allowlistAmount)
      createPoolPage.getAllowlistSaveButton().click()

      // Assert
      createPoolPage.assertPrivacyRadioButtons(PoolPrivacy.PRIVATE)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.exist')
      createPoolPage.getNextButton().should('not.exist')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getEditAddressesButton().should('not.be.disabled')
      createPoolPage.getEditCollectionsButton().should('not.exist')
      createPoolPage.getCreateButton().should('not.be.disabled')
    })

    it('NFT pool privacy', () => {
      createPoolPage.getPrivacyLabeledRadioButton(PoolPrivacy.NFT).click()

      // Assert
      createPoolPage.assertPrivacyRadioButtons(PoolPrivacy.NFT)
      createPoolPage.getLeftArrowButton().should('not.be.disabled')
      createPoolPage.getRightArrowButton().should('not.exist')
      createPoolPage.getNextButton().should('not.exist')
      createPoolPage.getCurrentStepError().should('not.exist')
      createPoolPage.getEditAddressesButton().should('not.exist')
      createPoolPage.getEditCollectionsButton().should('not.be.disabled')
      createPoolPage.getCreateButton().should('not.be.disabled')
    })
  })
})
