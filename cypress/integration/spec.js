const path = require('path')

/* global describe, it, cy, beforeEach */
describe('hydrate-app', function () {
  const page = path.join(__dirname, '../../dist/index.html')

  beforeEach(() => {
    cy.visit(page)
  })

  it('has header', () => {
    cy.contains('h2', 'app demo')
      .should('be.visible')
  })

  it('loads example app', function () {
    cy.contains('.tinyToast', 'is loading')
    cy.contains('.tinyToast', 'is running')
    cy.wait(1000)
  })
})
