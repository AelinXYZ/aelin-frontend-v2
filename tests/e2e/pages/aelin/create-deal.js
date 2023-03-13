/* eslint-disable ui-testing/no-hard-wait */
/* eslint-disable cypress/no-unnecessary-waiting */

import clone from 'lodash/clone'

import Header from './header'
import TimeLine from '../../components/timeline'
import Page, { Transaction } from '../page'

export default class CreateDealPage extends Page {
  constructor(fakeDeal) {
    super()
    this.header = new Header()
    this.timeLine = new TimeLine()
    this.fakeDeal = clone(fakeDeal)
    this.DealToken_Address = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' // UNI
    // Should be taken from envs
  }

  login() {
    this.header.login()
  }

  nextStep() {
    cy.dataCy('deal-create-next-btn').click()
  }

  getFormTitle() {
    return cy.contains('Deal creation')
  }

  getPoolTitle() {
    return cy.get('span').contains(this.fakeDeal.poolName)
  }

  getSummaryItem(item) {
    return cy.dataCy(`summary-item-${item}`)
  }

  getDealTokenModalButton() {
    return cy.dataCy('form-token-btn-dropdown')
  }

  getDealTokenModalInput() {
    return cy.dataCy('form-token-modal-input')
  }

  getDealTokenModalConfirmBtn() {
    return cy.dataCy('form-token-modal-confirm-btn')
  }

  getTotalPurchaseAmountInput() {
    return cy.dataCy('total-purchase-amount-input')
  }

  getDealTokenTotalInput() {
    return cy.dataCy('deal-token-total-input')
  }

  getPartialLabeledRadioButton() {
    return cy.dataCy('labeled-radio-btn-partial').find('span')
  }

  getSummaryDealToken() {
    return cy.dataCy('external-link-children')
  }

  getDeadlineDuration(period) {
    return cy.dataCy(`hmsInput-duration${period}`)
  }

  getCounterPartyAddressInput() {
    return cy.dataCy('counterparty-address-input')
  }

  getActiveTimeLineStepTitle() {
    return this.timeLine.getActiveStepTitle()
  }

  getCreateButton() {
    return cy.dataCy('create-deal-form-btn')
  }

  typePoolData() {
    //Deal Token
    this.getDealTokenModalButton().click()
    this.getDealTokenModalInput().type(this.DealToken_Address)
    this.getDealTokenModalConfirmBtn().click()
    this.nextStep()

    //Total investment amount
    this.getPartialLabeledRadioButton().click()
    this.getTotalPurchaseAmountInput().type(this.fakeDeal.totalInvestmentAmount)
    this.nextStep()

    //Deal token total
    this.getDealTokenTotalInput().type(this.fakeDeal.dealTokenTotal)
    this.nextStep()

    //Vesting cliff
    this.getDeadlineDuration('Minutes').type(this.fakeDeal.vestingCliffMinutes)
    this.nextStep()

    //Vesting Period
    this.getDeadlineDuration('Minutes').type(this.fakeDeal.vestingPeriodMinutes)
    this.nextStep()

    //Round 1: Accept Allocation
    this.getDeadlineDuration('Minutes').type(this.fakeDeal.round1Minutes)
    this.nextStep()

    //Round 1: Accept Remaining
    this.getDeadlineDuration('Minutes').type(this.fakeDeal.round2Minutes)
    this.nextStep()

    //Token Holder Funding Period
    this.getDeadlineDuration('Days').type(this.fakeDeal.holderPeriodDays)
    this.getDeadlineDuration('Hours').type(this.fakeDeal.holderPeriodHours)
    this.getDeadlineDuration('Minutes').type(this.fakeDeal.holderPeriodMinutes)
    this.nextStep()

    //Token Holder Address
    this.getCounterPartyAddressInput().type(this.fakeDeal.holderAddress)
  }

  createDeal() {
    this.getCreateButton().click()
    this.confirmModalTransaction()
    this.confirmMetamaskTransaction()
    this.waitUntilTransaction(Transaction.Confirmed)
  }
}
