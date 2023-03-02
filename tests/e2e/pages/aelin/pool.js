/* eslint-disable ui-testing/no-hard-wait */
/* eslint-disable cypress/no-unnecessary-waiting */
import Header from './header'
import ActionBox from '../../components/actionBox'
import PoolInformation from '../../components/poolInformation'
import TimeLine from '../../components/timeline'
import Page, { Transaction } from '../page'

export default class PoolPage extends Page {
  constructor() {
    super()
    this.header = new Header()
    this.timeLine = new TimeLine()
    this.poolInformation = new PoolInformation()
    this.actionBox = new ActionBox()
  }

  approve() {
    this.actionBox.approve()
    this.confirmModalTransaction()
    this.confirmPermissionToSpend()
    this.waitUntilTransaction(Transaction.Confirmed)
  }

  deposit(tokens) {
    this.actionBox.deposit(tokens)
    this.confirmModalTransaction()
    this.confirmMetamaskTransaction()
    this.waitUntilTransaction(Transaction.Confirmed)
  }

  depositMax() {
    this.actionBox.depositMax()
    this.confirmModalTransaction()
    this.confirmMetamaskTransaction()
    this.waitUntilTransaction(Transaction.Confirmed)
  }

  approveAndDeposit(tokens) {
    this.actionBox.approve()
    this.confirmModalTransaction()
    this.confirmPermissionToSpend()

    // Wait for Deposit Button to appear
    this.waitForCyComponentToExist(this.actionBox.getInput)

    this.actionBox.deposit(tokens)
    this.confirmModalTransaction()
    this.confirmMetamaskTransaction()
    this.waitUntilTransaction(Transaction.Confirmed)
  }
}
