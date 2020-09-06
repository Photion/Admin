/// <reference types="cypress" />

context('/', () => {
  describe('Without a client in localStorage', () => {
    beforeEach(() => {
      window.localStorage.removeItem('PHOTION_INTEGRATION');
      cy.visit('/');
    });

    it('Displays a valid page', () => {
      cy.get('a[href="/services"]').should('exist');
      cy.get('a[href="/concepts"]').should('not.exist');
    });
  });

  describe('Without a client in localStorage', () => {
    beforeEach(() => {
      window.localStorage.setItem('PHOTION_INTEGRATION', 'http');
      cy.visit('/');
    });

    it('Displays a valid page', () => {
      cy.get('a[href="/services"]');
      cy.get('a[href="/concepts"]').should('exist');
    });
  });

});
