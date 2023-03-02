/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable ui-testing/no-hard-wait */

export default class ActionBox {
  getInput() {
    return cy.get("[data-cy='action-box-wrapper']").find('input')
  }

  getApproveTokenBtn() {
    return cy.get("[data-cy='action-box-wrapper']").find('button').contains('Approve')
  }

  getDepositBtn() {
    return cy.get("[data-cy='action-box-wrapper']").find('button').contains('Deposit')
  }

  getTitle() {
    return cy.get("[data-cy='action-box-wrapper']").find('h4')
  }

  getDescription() {
    return cy.get("[data-cy='action-box-wrapper']").find('p')
  }

  getCreateDealBtn() {
    return cy.get("[data-cy='action-box-wrapper']").find('a').contains('Create Deal')
  }

  getDepositMaxBtn() {
    return cy.get("[data-cy='token-input-max-btn']")
  }

  getErrorMessage() {
    return cy.get("[data-cy='token-input-error']")
  }

  approve() {
    this.getApproveTokenBtn().click()
  }

  deposit(tokens) {
    this.getInput().type(tokens)
    this.getDepositBtn().click()
  }

  depositMax() {
    this.getDepositMaxBtn().click()
    this.getDepositBtn().click()
  }
}
