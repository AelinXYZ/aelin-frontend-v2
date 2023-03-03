/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable ui-testing/no-hard-wait */

export default class PoolInformation {
  getAllElements() {
    return cy.dataCy('info-cell')
  }
  getNthElement(n) {
    return this.getAllElements().eq(n).find('div')
  }
  getInvestmentTokenSymbol() {
    return cy.dataCy('external-link-children').eq(0)
  }
  getPoolCap() {
    return this.getNthElement(1).eq(1)
  }
  getPoolStats() {
    return this.getNthElement(2).eq(1)
  }
  getMyPoolBalance() {
    return this.getNthElement(4).eq(1)
  }
  getInvestmentDeadline() {
    return this.getNthElement(5).eq(1)
  }
  getDealDeadline() {
    return this.getNthElement(6).eq(1)
  }
  getSponsor() {
    return cy.dataCy('external-link-children').eq(1)
  }
  getParticipants() {
    return this.getNthElement(9).eq(1)
  }
}
