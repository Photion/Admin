/// <reference types="cypress" />

context('/services/gcp', () => {
  describe('Without a client in localStorage', () => {
    beforeEach(() => {
      window.localStorage.removeItem('PHOTION_INTEGRATION');
      cy.visit('/services/gcp');
    });

    it('Displays a valid page', () => {
      cy.getCy('field:user.name');
      cy.getCy('field:user.password');
      cy.getCy('button:service.soon');

      cy.getCy('integration-gcp')
        .contains('Back to all services')
        .click();

      cy.location('pathname')
        .should('eq', '/services');
    });
  });

});
