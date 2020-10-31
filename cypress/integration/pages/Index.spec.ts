/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('/', () => {
  after(() => {
    cy.clearIntegrations();
  });

  describe('Without a client in localStorage', () => {
    beforeEach(() => {
      cy.clearIntegrations();
      cy.visit('/');
    });

    it('Shows only the /services card', () => {
      cy.get('a[href="/services"]').should('exist');
      cy.get('a[href="/folders"]').should('not.exist');
      cy.getCy('index.service').should('not.exist');
    });
  });

  describe('Using the HTTP Client', () => {
    beforeEach(() => {
      cy.useHttp();
      cy.visit('/');
    });

    it('Shows the /folders card and the HTTP Client name', () => {
      cy.get('a[href="/services"]');
      cy.get('a[href="/folders"]').should('exist');
      cy.getCy('index.service').contains('Your HTTP API');
    });
  });

  describe('Using the AWS Client', () => {
    beforeEach(() => {
      cy.useAws();
      cy.visit('/');
    });

    it('Shows the /folders card and the AWS Client name', () => {
      cy.get('a[href="/services"]');
      cy.get('a[href="/folders"]').should('exist');
      cy.getCy('index.service').contains('Amazon Web Services');
    });
  });


});
