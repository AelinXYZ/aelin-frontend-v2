/* eslint-disable ui-testing/no-hard-wait */
/* eslint-disable cypress/no-unnecessary-waiting */

import Header from './header'
import TimeLine from '../../components/timeline'
import Page, { Transaction } from '../page'

export const PoolPrivacy = {
  PUBLIC: 'Public',
  PRIVATE: 'Private',
  NFT: 'NFT',
}

export const CreatePoolSteps = {
  PoolName: 1,
  PoolSymbol: 2,
  InvestmentToken: 3,
  InvestmentDeadLine: 4,
  DealDeadline: 5,
  PoolCap: 6,
  SponsorFee: 7,
  PoolPrivacy: 8,
}

export default class CreatePoolPage extends Page {
  constructor() {
    super()
    this.header = new Header()
    this.timeLine = new TimeLine()
    // Should be taken from envs
  }

  visit() {
    cy.visit('/pool/create')
  }

  login() {
    this.header.login()
  }

  nextStep() {
    this.getNextButton().click()
  }

  getNameInput() {
    return cy.dataCy('pool-name-input')
  }

  getSymbolInput() {
    return cy.dataCy('pool-symbol-input')
  }

  getSummaryItem(item) {
    return cy.dataCy(`summary-item-${item}`)
  }

  getInvestmentTokenModalButton() {
    return cy.dataCy('form-token-btn-dropdown')
  }

  getInvestmentTokenModalInput() {
    return cy.dataCy('form-token-modal-input')
  }

  getTokenSelectionModalItem() {
    return cy.dataCy('token-selection-modal-item')
  }

  getInvestmentTokenModalConfirmBtn() {
    return cy.dataCy('form-token-modal-confirm-btn')
  }

  getSummaryInvestmentToken() {
    return cy.dataCy('external-link-children')
  }

  getDeadlineDuration(period) {
    return cy.dataCy(`hmsInput-duration${period}`)
  }

  getNoCapLabeledCheckBox() {
    return cy.dataCy('no-cap-labeled-checkbox')
  }

  getNoCapCheckBox() {
    return this.getNoCapLabeledCheckBox().find("[data-cy='checkbox']")
  }

  getNoCapInput() {
    return cy.dataCy('no-cap-input')
  }

  getSponsorFeeInput() {
    return cy.dataCy('sponsor-fee-input')
  }

  getPrivacyLabeledRadioButton(privacy) {
    return cy.dataCy(`labeled-radio-btn-${privacy.toLowerCase()}`)
  }

  getPrivacyRadioButton(privacy) {
    return this.getPrivacyLabeledRadioButton(privacy).find("[data-cy='radio-btn']")
  }

  getActiveTimeLineStepTitle() {
    return this.timeLine.getActiveStepTitle()
  }

  getLeftArrowButton() {
    return cy.dataCy('pool-create-left-arrow-btn')
  }

  getRightArrowButton() {
    return cy.dataCy('pool-create-right-arrow-btn')
  }

  getNextButton() {
    return cy.dataCy('pool-create-next-btn')
  }

  getCreateButton() {
    return cy.dataCy('pool-create-btn')
  }

  getCurrentStepError() {
    return cy.dataCy('pool-create-current-step-error')
  }

  getEditAddressesButton() {
    return cy.dataCy('pool-create-edit-addresses-btn')
  }

  getEditCollectionsButton() {
    return cy.dataCy('pool-create-edit-collections-btn')
  }

  getFirstAllowlistAddressInput() {
    return cy.dataCy('allowlist-address-input').first()
  }

  getFirstAllowlistAmountInput() {
    return cy.dataCy('allowlist-amount-input').first()
  }

  getAllowlistNextButton() {
    return cy.dataCy('allowlist-next-btn')
  }

  getAllowlistSaveButton() {
    return cy.dataCy('allowlist-save-btn')
  }

  typePoolData(fakePool, step = CreatePoolSteps.PoolPrivacy) {
    //Pool Name
    if (step >= CreatePoolSteps.PoolName) {
      this.getNameInput().type(fakePool.name)
      this.nextStep()
    }

    //Pool Symbol
    if (step >= CreatePoolSteps.PoolSymbol) {
      this.getSymbolInput().type(fakePool.symbol)
      this.nextStep()
    }

    //Purchase Token
    if (step >= CreatePoolSteps.InvestmentToken) {
      this.getInvestmentTokenModalButton().click()
      this.getInvestmentTokenModalInput().type(fakePool.purchaseTokenSymbol)
      this.getTokenSelectionModalItem().click()
      this.nextStep()
    }

    //Investment Deadline
    if (step >= CreatePoolSteps.InvestmentDeadLine) {
      this.getDeadlineDuration('Minutes').type(fakePool.investmentDeadlineMinutes)
      this.nextStep()
    }

    //Deal Deadline
    if (step >= CreatePoolSteps.DealDeadline) {
      this.getDeadlineDuration('Days').type(fakePool.dealDeadlineDays)
      this.getDeadlineDuration('Hours').type(fakePool.dealDeadlineHours)
      this.getDeadlineDuration('Minutes').type(fakePool.dealDeadlineMinutes)
      this.nextStep()
    }

    //PoolCap
    if (step >= CreatePoolSteps.PoolCap) {
      this.getNoCapLabeledCheckBox().click()
      this.getNoCapInput().type(fakePool.poolCap)
      this.nextStep()
    }

    //SponsorFee
    if (step >= CreatePoolSteps.SponsorFee) {
      this.getSponsorFeeInput().type(fakePool.sponsorFee)
      this.nextStep()
    }

    //Pool Privacy
    if (step === CreatePoolSteps.PoolPrivacy) {
      this.assignPoolPrivacy(fakePool.privacy)
    }
  }

  createPool() {
    this.getCreateButton().click()
    this.confirmModalTransaction()
    this.confirmMetamaskTransaction()
    this.waitUntilTransaction(Transaction.Confirmed)
  }

  assignPoolPrivacy(privacy) {
    switch (privacy) {
      case PoolPrivacy.PUBLIC:
        return this.getPrivacyLabeledRadioButton(privacy).click()
      case PoolPrivacy.PRIVATE:
        // Private pool logic
        break
      case PoolPrivacy.NFT:
        // NFT pool logic
        break
      default:
        return this.getPrivacyLabeledRadioButton(privacy).click()
    }
  }

  assertNoCapCheckBox(checked) {
    return this.getNoCapCheckBox().should(
      'have.css',
      'background-color',
      checked ? 'rgb(130, 128, 255)' : 'rgba(255, 255, 255, 0.04)',
    )
  }

  assertPrivacyRadioButton(privacy, checked) {
    return this.getPrivacyRadioButton(privacy).should(
      'have.css',
      'background-color',
      checked ? 'rgb(130, 128, 255)' : 'rgba(255, 255, 255, 0.04)',
    )
  }

  assertPrivacyRadioButtons(privacy) {
    switch (privacy) {
      case PoolPrivacy.PUBLIC:
        this.assertPrivacyRadioButton(PoolPrivacy.PUBLIC, true)
        this.assertPrivacyRadioButton(PoolPrivacy.PRIVATE, false)
        this.assertPrivacyRadioButton(PoolPrivacy.NFT, false)
        break
      case PoolPrivacy.PRIVATE:
        this.assertPrivacyRadioButton(PoolPrivacy.PUBLIC, false)
        this.assertPrivacyRadioButton(PoolPrivacy.PRIVATE, true)
        this.assertPrivacyRadioButton(PoolPrivacy.NFT, false)
        break
      case PoolPrivacy.NFT:
        this.assertPrivacyRadioButton(PoolPrivacy.PUBLIC, false)
        this.assertPrivacyRadioButton(PoolPrivacy.PRIVATE, false)
        this.assertPrivacyRadioButton(PoolPrivacy.NFT, true)
        break
      default:
        this.assertPrivacyRadioButton(PoolPrivacy.PUBLIC, false)
        this.assertPrivacyRadioButton(PoolPrivacy.PRIVATE, false)
        this.assertPrivacyRadioButton(PoolPrivacy.NFT, false)
    }
  }
}
