/// <reference types="cypress" />

context.only('/services/browser', () => {
  const user = {
    name: 'cypress.user',
    password: 'cypress.password',
  };

  describe('Without sessionStorage data', () => {
    beforeEach(() => {
      window.localStorage.removeItem('PHOTION_INTEGRATION');
      window.sessionStorage.removeItem('PHOTION_USERNAME');

      cy.visit('/services/browser');
    });

    it('Displays a valid page', () => {
      cy.getCy('field:user.name');
      cy.getCy('field:user.password');

      cy.getCy('integration:browser')
        .contains('Back to all services')
        .click();

      cy.location('pathname')
        .should('eq', '/services');
    });

    it('Stores the username in the session storage', () => {
      cy.getCy('field:user.name')
        .type(user.name)
        .then(() => {
          expect(window.sessionStorage.getItem('PHOTION_USERNAME')).to.be.equal(user.name);
        });

    });

    it('Compiles the form and stores the credentials', () => {
      cy.getCy('field:user.name')
        .type(user.name);

      cy.getCy('field:user.password')
        .type(user.password);

      cy.getCy('button:service.continue')
        .click()
        .then(() => {
          const integration = window.localStorage.getItem('PHOTION_INTEGRATION');
          expect(integration).to.be.equal('browser');
        });
    });

  });
});
