/// <reference types="cypress" />

context('/services/googleDrive', () => {
  describe('Without a client in localStorage', () => {
    beforeEach(() => {
      window.localStorage.removeItem('PHOTION_INTEGRATION');
      cy.visit('/services/googleDrive');
    });

    it('Displays a valid page', () => {
      cy.getCy('field:user.name');
      cy.getCy('field:user.password');
      cy.getCy('button:service.soon');

      cy.getCy('integration:googleDrive')
        .contains('Back to all services')
        .click();

      cy.location('pathname')
        .should('eq', '/services');
    });
  });

});
