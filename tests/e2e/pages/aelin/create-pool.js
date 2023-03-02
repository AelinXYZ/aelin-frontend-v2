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
    cy.get("[data-cy='pool-create-next-btn']").click()
  }

  getNameInput() {
    return cy.get("[data-cy='pool-name-input']")
  }

  getSymbolInput() {
    return cy.get("[data-cy='pool-symbol-input']")
  }

  getSummaryItem(item) {
    return cy.get(`[data-cy='summary-item-${item}']`)
  }

  getInvestmentTokenModalButton() {
    return cy.get("[data-cy='form-token-btn-dropdown']")
  }

  getInvestmentTokenModalInput() {
    return cy.get("[data-cy='from-token-modal-input']")
  }

  getTokenSelectionModalItem() {
    return cy.get("[data-cy='token-selection-modal-item']")
  }

  getInvestmentTokenModalConfirmBtn() {
    return cy.get("[data-cy='form-token-modal-confirm-btn']")
  }

  getSummaryInvestmentToken() {
    return cy.get("[data-cy='external-link-children']")
  }

  getDeadlineDuration(period) {
    return cy.get(`[data-cy='hmsInput-duration${period}']`)
  }

  getNoCapCheckBox() {
    return cy.get("[data-cy='no-cap-checkbox']")
  }

  getNoCapInput() {
    return cy.get("[data-cy='no-cap-input']")
  }

  getSponsorFeeInput() {
    return cy.get("[data-cy='sponsor-fee-input']")
  }

  getPrivacyButton(privacy) {
    return cy.get(`[data-cy='radio-btn-${privacy}']`)
  }

  getActiveTimeLineStepTitle() {
    return this.timeLine.getActiveStepTitle()
  }

  geCreateButton() {
    return cy.get("[data-cy='pool-create-btn']")
  }

  typePoolData(fakePool) {
    //Pool Name
    this.getNameInput().type(fakePool.name)
    this.nextStep()

    //Pool Symbol
    this.getSymbolInput().type(fakePool.symbol)
    this.nextStep()

    //Purchase Token
    this.getInvestmentTokenModalButton().click()
    this.getInvestmentTokenModalInput().type(fakePool.purchaseTokenSymbol)
    this.getTokenSelectionModalItem().click()
    this.nextStep()

    //Investment Deadline
    this.getDeadlineDuration('Minutes').type(fakePool.investmentDeadlineMinutes)
    this.nextStep()

    //Deal Deadline
    this.getDeadlineDuration('Days').type(fakePool.dealDeadlineDays)
    this.getDeadlineDuration('Hours').type(fakePool.dealDeadlineHours)
    this.getDeadlineDuration('Minutes').type(fakePool.dealDeadlineMinutes)
    this.nextStep()

    //PoolCap
    this.getNoCapCheckBox().click()
    this.getNoCapInput().type(fakePool.poolCap)
    this.nextStep()

    //SponsorFee
    this.getSponsorFeeInput().type(fakePool.sponsorFee)
    this.nextStep()

    //Pool Privacy
    this.assignPoolPrivacy(fakePool.privacy)
  }

  createPool() {
    this.geCreateButton().click()
    this.confirmModalTransaction()
    this.confirmMetamaskTransaction()
    this.waitUntilTransaction(Transaction.Confirmed)
  }

  assignPoolPrivacy(privacy) {
    switch (privacy) {
      case PoolPrivacy.PUBLIC:
        return this.getPrivacyButton(privacy.toLowerCase()).click()
      case PoolPrivacy.PRIVATE:
        // Private pool logic
        break
      case PoolPrivacy.NFT:
        // NFT pool logic
        break
      default:
        return this.getPrivacyButton(privacy.toLowerCase()).click()
    }
  }
}
