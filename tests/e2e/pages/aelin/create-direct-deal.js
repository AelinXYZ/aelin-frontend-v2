/* eslint-disable ui-testing/no-hard-wait */
/* eslint-disable cypress/no-unnecessary-waiting */

import Header from './header'
import TimeLine from '../../components/timeline'
import Page from '../page'

export const DirectDealPrivacy = {
  PUBLIC: 'Public',
  PRIVATE: 'Private',
  NFT: 'NFT',
}

export const CreateDirectDealSteps = {
  DealNaming: 1,
  InvestmentToken: 2,
  RedemptionDeadline: 3,
  SponsorFee: 4,
  HolderAddress: 5,
  DealToken: 6,
  DealAccess: 7,
  ExchangeRates: 8,
  VestingSchedule: 9,
}

export default class CreateDirectDealPage extends Page {
  constructor() {
    super()
    this.header = new Header()
    this.timeLine = new TimeLine()
  }

  visit() {
    cy.visit('/deal/create')
  }

  login() {
    this.header.login()
  }

  nextStep() {
    this.getNextButton().click()
  }

  getActiveTimeLineStepTitle() {
    return this.timeLine.getActiveStepTitle()
  }

  getSummaryItem(item) {
    return cy.dataCy(`summary-item-${item}`)
  }

  getNameInput() {
    return cy.dataCy('direct-deal-name-input')
  }

  getSymbolInput() {
    return cy.dataCy('direct-deal-symbol-input')
  }

  getTokenModalButton() {
    return cy.dataCy('form-token-btn-dropdown')
  }

  getTokenModalInput() {
    return cy.dataCy('form-token-modal-input')
  }

  getTokenSelectionModalItem() {
    return cy.dataCy('token-selection-modal-item')
  }

  getTokenModalConfirmBtn() {
    return cy.dataCy('form-token-modal-confirm-btn')
  }

  getDeadlineDuration(period) {
    return cy.dataCy(`hmsInput-duration${period}`)
  }

  getSponsorFeeInput() {
    return cy.dataCy('sponsor-fee-input')
  }

  getNoSponsorFeeLabeledCheckBox() {
    return cy.dataCy('no-sponsor-fee-labeled-checkbox')
  }

  getNoSponsorFeeCheckBox() {
    return this.getNoSponsorFeeLabeledCheckBox().find("[data-cy='checkbox']")
  }

  getHolderAddressInput() {
    return cy.dataCy('holder-address-input')
  }

  getPrivacyLabeledRadioButton(privacy) {
    return cy.dataCy(`labeled-radio-btn-${privacy.toLowerCase()}`)
  }

  getPrivacyRadioButton(privacy) {
    return this.getPrivacyLabeledRadioButton(privacy).find("[data-cy='radio-btn']")
  }

  getLeftArrowButton() {
    return cy.dataCy('direct-deal-create-left-arrow-btn')
  }

  getRightArrowButton() {
    return cy.dataCy('direct-deal-create-right-arrow-btn')
  }

  getNextButton() {
    return cy.dataCy('direct-deal-create-next-btn')
  }

  getCreateButton() {
    return cy.dataCy('direct-deal-create-btn')
  }

  getCurrentStepError() {
    return cy.dataCy('direct-deal-create-current-step-error')
  }

  getEditAddressesButton() {
    return cy.dataCy('direct-deal-create-edit-addresses-btn')
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

  getEditCollectionsButton() {
    return cy.dataCy('direct-deal-create-edit-collections-btn')
  }

  getNftWhiteListNextButton() {
    return cy.dataCy('nft-white-list-next-btn')
  }

  getNftWhiteListCollectionInput() {
    return cy.dataCy('nft-white-list-collection-input')
  }

  getNftWhiteListCollectionItem() {
    return cy.dataCy('nft-white-list-collection-item')
  }

  getInvestmentAmountToRaiseInput() {
    return cy.dataCy('investment-amount-to-raise-input')
  }

  getExchangeRateInput() {
    return cy.dataCy('exchange-rate-input')
  }

  getDealTotalInfo() {
    return cy.dataCy('deal-total-info')
  }

  getInvestmentPerDealInfo() {
    return cy.dataCy('deal-investment-per-deal-info')
  }

  getDealCappedLabeledRadioButton(yes) {
    return cy.dataCy(`deal-capped-labeled-radio-btn-${yes ? 'yes' : 'no'}`)
  }

  getDealCappedRadioButton(yes) {
    return this.getDealCappedLabeledRadioButton(yes).find("[data-cy='radio-btn']")
  }

  getDealHasMinimumLabeledRadioButton(yes) {
    return cy.dataCy(`deal-has-minimum-labeled-radio-btn-${yes ? 'yes' : 'no'}`)
  }

  getDealHasMinimumRadioButton(yes) {
    return this.getDealHasMinimumLabeledRadioButton(yes).find("[data-cy='radio-btn']")
  }

  getInvestmentMinimumAmountInput() {
    return cy.dataCy('investment-minimum-amount-input')
  }

  getVestingCliffDuration(period) {
    return cy.dataCy(`hmsInput-duration${period}`).first()
  }

  getVestingPeriodDuration(period) {
    return cy.dataCy(`hmsInput-duration${period}`).last()
  }

  typeDirectDealData(fakeDirectDeal, step = CreateDirectDealSteps.VestingSchedule) {
    if (step >= CreateDirectDealSteps.DealNaming) {
      this.getNameInput().type(fakeDirectDeal.name, { parseSpecialCharSequences: false })
      this.getSymbolInput().type(fakeDirectDeal.symbol, { parseSpecialCharSequences: false })
      this.nextStep()
    }

    if (step >= CreateDirectDealSteps.InvestmentToken) {
      this.getTokenModalButton().click()
      this.getTokenModalInput().type(fakeDirectDeal.investmentTokenSymbol)
      this.getTokenSelectionModalItem().click()
      this.nextStep()
    }

    if (step >= CreateDirectDealSteps.RedemptionDeadline) {
      this.getDeadlineDuration('Days').type(fakeDirectDeal.redemptionDeadlineDays)
      this.nextStep()
    }

    if (step >= CreateDirectDealSteps.SponsorFee) {
      this.getNoSponsorFeeLabeledCheckBox().click()
      this.getSponsorFeeInput().clear()
      this.getSponsorFeeInput().type(fakeDirectDeal.sponsorFee)
      this.nextStep()
    }

    if (step >= CreateDirectDealSteps.HolderAddress) {
      this.getHolderAddressInput().type(fakeDirectDeal.holderAddress)
      this.nextStep()
    }

    if (step >= CreateDirectDealSteps.DealToken) {
      this.getTokenModalButton().click()
      this.getTokenModalInput().type(fakeDirectDeal.dealTokenSymbol)
      this.getTokenSelectionModalItem().click()
      this.nextStep()
    }

    if (step >= CreateDirectDealSteps.DealAccess) {
      this.getPrivacyLabeledRadioButton(fakeDirectDeal.privacy).click()
      this.nextStep()
    }

    if (step >= CreateDirectDealSteps.ExchangeRates) {
      this.getInvestmentAmountToRaiseInput().type(fakeDirectDeal.investmentAmountToRaise)
      this.getExchangeRateInput().type(fakeDirectDeal.exchangeRate)
      this.nextStep()
    }
  }

  assertNoSponsorFeeCheckBox(checked) {
    return this.getNoSponsorFeeCheckBox().should(
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
      case DirectDealPrivacy.PUBLIC:
        this.assertPrivacyRadioButton(DirectDealPrivacy.PUBLIC, true)
        this.assertPrivacyRadioButton(DirectDealPrivacy.PRIVATE, false)
        this.assertPrivacyRadioButton(DirectDealPrivacy.NFT, false)
        break
      case DirectDealPrivacy.PRIVATE:
        this.assertPrivacyRadioButton(DirectDealPrivacy.PUBLIC, false)
        this.assertPrivacyRadioButton(DirectDealPrivacy.PRIVATE, true)
        this.assertPrivacyRadioButton(DirectDealPrivacy.NFT, false)
        break
      case DirectDealPrivacy.NFT:
        this.assertPrivacyRadioButton(DirectDealPrivacy.PUBLIC, false)
        this.assertPrivacyRadioButton(DirectDealPrivacy.PRIVATE, false)
        this.assertPrivacyRadioButton(DirectDealPrivacy.NFT, true)
        break
      default:
        this.assertPrivacyRadioButton(DirectDealPrivacy.PUBLIC, false)
        this.assertPrivacyRadioButton(DirectDealPrivacy.PRIVATE, false)
        this.assertPrivacyRadioButton(DirectDealPrivacy.NFT, false)
    }
  }

  assertDealCappedRadioButton(yes, checked) {
    return this.getDealCappedRadioButton(yes).should(
      'have.css',
      'background-color',
      checked ? 'rgb(130, 128, 255)' : 'rgba(255, 255, 255, 0.04)',
    )
  }

  assertDealCappedRadioButtons(yes) {
    if (yes) {
      this.assertDealCappedRadioButton(true, true)
      this.assertDealCappedRadioButton(false, false)
    } else {
      this.assertDealCappedRadioButton(true, false)
      this.assertDealCappedRadioButton(false, true)
    }
  }

  assertDealHasMinimumRadioButton(yes, checked) {
    return this.getDealHasMinimumRadioButton(yes).should(
      'have.css',
      'background-color',
      checked ? 'rgb(130, 128, 255)' : 'rgba(255, 255, 255, 0.04)',
    )
  }

  assertDealHasMinimumRadioButtons(yes) {
    if (yes) {
      this.assertDealHasMinimumRadioButton(true, true)
      this.assertDealHasMinimumRadioButton(false, false)
    } else {
      this.assertDealHasMinimumRadioButton(true, false)
      this.assertDealHasMinimumRadioButton(false, true)
    }
  }

  assertDetails(fakeDirectDeal, step = CreateDirectDealSteps.VestingSchedule, expected) {
    let title = step > CreateDirectDealSteps.DealNaming ? fakeDirectDeal.name : 'Deal creation'
    let dealNaming =
      step > CreateDirectDealSteps.DealNaming
        ? [`Name: ${fakeDirectDeal.name}`, `Symbol: ${fakeDirectDeal.symbol}`]
        : '--'
    let redemptionDeadline =
      step > CreateDirectDealSteps.RedemptionDeadline
        ? `${fakeDirectDeal.redemptionDeadlineDays} days `
        : ''
    let holderAddress =
      step > CreateDirectDealSteps.HolderAddress
        ? `${fakeDirectDeal.holderAddress.slice(0, 6)}...${fakeDirectDeal.holderAddress.slice(
            fakeDirectDeal.holderAddress.length - 4,
            fakeDirectDeal.holderAddress.length,
          )}`
        : '--'
    let privacy = step > CreateDirectDealSteps.DealAccess ? fakeDirectDeal.privacy : '--'
    let vestingSchedule =
      step > CreateDirectDealSteps.VestingSchedule
        ? [
            `Cliff: ${fakeDirectDeal.vestingCliff} days `,
            `Period: ${fakeDirectDeal.vestingPeriod} days `,
          ]
        : '--'
    let investmentTokenSymbol =
      step > CreateDirectDealSteps.InvestmentToken ? fakeDirectDeal.investmentTokenSymbol : '--'
    let sponsorFee =
      step > CreateDirectDealSteps.SponsorFee ? `${fakeDirectDeal.sponsorFee}%` : '--'
    let dealTokenSymbol =
      step > CreateDirectDealSteps.DealToken ? fakeDirectDeal.dealTokenSymbol : '--'
    let exchangeRates =
      step > CreateDirectDealSteps.ExchangeRates
        ? [
            `${fakeDirectDeal.exchangeRate} ${fakeDirectDeal.dealTokenSymbol} per  ${fakeDirectDeal.investmentTokenSymbol}`,
            `${1 / fakeDirectDeal.exchangeRate} ${fakeDirectDeal.investmentTokenSymbol} per ${
              fakeDirectDeal.dealTokenSymbol
            }`,
          ]
        : '--'

    switch (step) {
      case CreateDirectDealSteps.DealNaming:
        title = expected.title
        dealNaming = expected.dealNaming
        break
      case CreateDirectDealSteps.InvestmentToken:
        investmentTokenSymbol = expected.investmentTokenSymbol
        break
      case CreateDirectDealSteps.RedemptionDeadline:
        redemptionDeadline = expected.redemptionDeadline
        break
      case CreateDirectDealSteps.SponsorFee:
        sponsorFee = expected.sponsorFee
        break
      case CreateDirectDealSteps.HolderAddress:
        holderAddress = expected.holderAddress
        break
      case CreateDirectDealSteps.DealToken:
        dealTokenSymbol = expected.dealTokenSymbol
        break
      case CreateDirectDealSteps.DealAccess:
        privacy = expected.privacy
        break
      case CreateDirectDealSteps.ExchangeRates:
        exchangeRates = expected.exchangeRates
        break
      case CreateDirectDealSteps.VestingSchedule:
        vestingSchedule = expected.vestingSchedule
    }

    this.getTitle().should('have.text', title)

    if (dealNaming === '--') {
      this.getSummaryItem('deal-naming').should('have.text', '--')
    } else {
      this.getSummaryItem('deal-naming')
        .children()
        .each(($el, index) => {
          cy.wrap($el).should('have.text', dealNaming[index])
        })
    }

    this.getSummaryItem('redemption-deadline').should('have.text', redemptionDeadline)

    if (holderAddress === '--') {
      this.getSummaryItem('holder-address').should('have.text', holderAddress)
    } else {
      this.getSummaryItem('holder-address')
        .find("[data-cy='external-link-children']")
        .should('have.text', holderAddress)
    }

    this.getSummaryItem('deal-access').should('have.text', privacy)

    if (vestingSchedule === '--') {
      this.getSummaryItem('vesting-schedule').should('have.text', '--')
    } else {
      this.getSummaryItem('vesting-schedule')
        .children()
        .first()
        .children()
        .each(($el, index) => {
          cy.wrap($el).should('have.text', vestingSchedule[index])
        })
    }

    if (investmentTokenSymbol === '--') {
      this.getSummaryItem('investment-token').should('have.text', investmentTokenSymbol)
    } else {
      this.getSummaryItem('investment-token')
        .find("[data-cy='external-link-children']")
        .should('have.text', investmentTokenSymbol)
    }

    this.getSummaryItem('sponsor-fee').should('have.text', sponsorFee)

    if (dealTokenSymbol === '--') {
      this.getSummaryItem('deal-token').should('have.text', dealTokenSymbol)
    } else {
      this.getSummaryItem('deal-token')
        .find("[data-cy='external-link-children']")
        .should('have.text', dealTokenSymbol)
    }

    if (exchangeRates === '--') {
      this.getSummaryItem('exchange-rates').should('have.text', '--')
    } else {
      this.getSummaryItem('exchange-rates')
        .children()
        .each(($el, index) => {
          cy.wrap($el).should('have.text', exchangeRates[index])
        })
    }

    this.getActiveTimeLineStepTitle().should('have.text', 'Deal Creation')
  }
}
