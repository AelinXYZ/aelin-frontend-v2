/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable ui-testing/no-hard-wait */

export default class TimeLine {
  getSteps() {
    return cy.get('.info')
  }

  getNthStep(index) {
    return this.getSteps().eq(index)
  }

  nthStepIsActive(index) {
    this.getNthStep(index)
      .should('have.attr', 'data-cy')
      .should('not.match', /inactive/)
  }

  nthStepIsNotActive(index) {
    this.getNthStep(index)
      .should('have.attr', 'data-cy')
      .and('match', /inactive/)
  }

  nthStepIsDone(index) {
    this.getNthStep(index)
      .invoke('attr', 'data-cy')
      .should((state) => state.includes('done'))
  }

  nthStepIsNotDone(index) {
    this.getNthStep(index)
      .invoke('attr', 'data-cy')
      .should((state) => state.includes('todo'))
  }

  getNthStepTitle(index) {
    return this.getSteps().eq(index).find('div > h4')
  }

  getNthStepContent(index) {
    return this.getSteps().eq(index).find('div > p')
  }

  getActiveStep() {
    return cy.dataCy('timeline-step-active-todo')
  }

  getActiveStepTitle() {
    // eslint-disable-next-line
    return cy.get("[data-cy='timeline-step-active-todo'] > div > h4")
  }

  getActiveStepContent() {
    // eslint-disable-next-line
    return cy.get("[data-cy='timeline-step-active-todo'] > div > p")
  }

  getDoneSteps() {
    return cy.dataCy('timeline-step-inactive-done')
  }
}
