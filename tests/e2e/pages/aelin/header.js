import Page from '../page'

export const Account = {
  Investor: 2,
  Sponsor: 3,
}

export default class Header extends Page {
  // constructor() {
  // super()
  // Investor already imported
  // cy.importMetamaskAccount("") // Sponsor
  // cy.importMetamaskAccount(Cypress.env('PRIVATE_KEY_3')) // Holder
  // }

  getConnectWalletBtn() {
    cy.dataCy('connect-btn').click()
    return cy.get('onboard-v2').shadow().contains('MetaMask')
  }
  getWalletButton() {
    return cy.dataCy('wallet-btn')
  }
  getSelectedNetwork() {
    return cy.dataCy('selected-network')
  }
  connectBrowserWallet() {
    const connectWalletButton = this.getConnectWalletBtn()
    connectWalletButton.click()
  }

  waitUntilLoggedIn() {
    cy.waitUntil(() => {
      const walletButton = this.getWalletButton()
      return walletButton.should('exist')
    })
    // waiting for wallet button is not enough in rare cases to be logged in
    // eslint-disable-next-line
    cy.wait(2000)
  }

  getLoggedInWalletAddress() {
    const walletButton = this.getWalletButton()
    return walletButton.invoke('text')
  }

  getConnectedNetwork() {
    const networkButton = this.getSelectedNetwork()
    return networkButton.invoke('text')
  }

  login(shouldAccept = true) {
    this.connectBrowserWallet()
    if (shouldAccept) this.acceptMetamaskAccessRequest(true)
    this.waitUntilLoggedIn()
  }

  switchAccount(name) {
    cy.switchMetamaskAccount(name)
  }

  importAccount(pk) {
    cy.importMetamaskAccount(pk)
  }
}
