import PoolBuilder from '../builders/poolStepper'
import CreatePoolPage from '../pages/aelin/create-pool'

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
  describe('Create Pool Stepper (public pool)', () => {
    beforeEach(() => {
      createPoolPage.visit()
      createPoolPage.login()
    })
    it('Should type all data and show it correctly in the summary and create Pool', () => {
      fakePool = new PoolBuilder()
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
})
