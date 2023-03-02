/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable ui-testing/no-hard-wait */

export const Transaction = {
  Confirmed: 'Transaction Confirmed',
  Failed: 'Transaction Failed',
  Sent: 'Transaction Sent',
}

export default class Page {
  getTitle() {
    return cy.get("[data-cy='page-title']")
  }

  getSubTitle() {
    return cy.get("[data-cy='page-subtitle']")
  }

  getMetamaskWalletAddress() {
    return cy.getMetamaskWalletAddress()
  }

  getToastMessage() {
    return cy.get("[data-cy='toast-message']")
  }

  acceptMetamaskAccessRequest(allAccounts) {
    cy.acceptMetamaskAccess(allAccounts)
  }

  confirmMetamaskTransaction() {
    cy.confirmMetamaskTransaction({ gasFee: 2.5, gasLimit: 5000000 })
  }

  confirmPermissionToSpend() {
    cy.confirmMetamaskPermissionToSpend()
  }

  waitUntilAvailableOnEtherscan(urlOrTx, alias) {
    if (!urlOrTx.includes('http')) {
      cy.getNetwork().then((network) => {
        const etherscanUrl =
          network.networkName === 'mainnet'
            ? `https://etherscan.io/tx/${urlOrTx}`
            : `https://${network.networkName}.etherscan.io/tx/${urlOrTx}`
        waitForTxSuccess(etherscanUrl, alias)
      })
    } else {
      waitForTxSuccess(urlOrTx, alias)
    }
  }

  disconnectMetamaskWalletFromAllDapps() {
    // this line is necessary to make sure we have a clean slate and empty a cached connection by a previous test spec
    cy.disconnectMetamaskWalletFromAllDapps()
  }

  confirmModalTransaction() {
    cy.get("[data-cy='transaction-modal-confirm-btn']").click()
  }

  waitForCyComponentToExist(cyComponent) {
    cy.waitUntil(() => {
      return cyComponent().should('exist')
    })
  }

  waitForCyComponentToUpdate(cyComponent) {
    cyComponent()
      .invoke('text')
      .then((prevValue) => {
        cy.waitUntil(() => {
          return cyComponent().should('not.have.text', prevValue)
        })
      })
  }

  waitUntilTransaction(message) {
    cy.waitUntil(() => {
      return this.getToastMessage().should('have.text', message)
    })
  }
}

function waitForTxSuccess(url, alias) {
  cy.request(url).as(alias)
  cy.get(`@${alias}`).then(async (response) => {
    if (
      response.body.includes('This transaction has been included into Block No') ||
      response.body.includes('</i> Pending</span>')
    ) {
      // eslint-disable-next-line
      cy.wait(5000)
      waitForTxSuccess(url, alias)
    }
  })
}
