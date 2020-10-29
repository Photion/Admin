/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

context('/', () => {
  describe('Without a client in localStorage', () => {
    beforeEach(() => {
      window.localStorage.removeItem('PHOTION_INTEGRATION');
      cy.visit('/');
    });

    it('Displays a valid page', () => {
      cy.get('a[href="/services"]').should('exist');
      cy.get('a[href="/folders"]').should('not.exist');
    });
  });

  describe('Using the HTTP Client', () => {
    beforeEach(() => {
      window.localStorage.setItem('PHOTION_INTEGRATION', 'http');
      cy.visit('/');
    });

    it('Displays a valid page', () => {
      cy.get('a[href="/services"]');
      cy.get('a[href="/folders"]').should('exist');
    });
  });

});
