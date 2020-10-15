/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('/services/browser', () => {
  describe('Without sessionStorage data', () => {
    beforeEach(() => {
      window.localStorage.removeItem('PHOTION_INTEGRATION');
      window.sessionStorage.removeItem('PHOTION_USERNAME');

      cy.visit('/services/browser');
    });

    it('Displays a valid page', () => {
      cy.getCy('integration:browser')
        .contains('Back to all services')
        .click();

      cy.location('pathname')
        .should('eq', '/services');
    });

    it('Compiles the form and stores the credentials', () => {
      cy.getCy('button:service.continue')
        .click()
        .then(() => {
          const integration = window.localStorage.getItem('PHOTION_INTEGRATION');
          expect(integration).to.be.equal('browser');
        });
    });

  });
});
