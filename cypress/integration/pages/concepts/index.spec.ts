/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import { concepts } from '../../../../tests/mocks/models';

context('/concepts', () => {
  describe('With no concepts', () => {
    beforeEach(() => {
      cy.useHttp();
      cy.server();
      cy.route('GET', '/api/concepts', []);
      cy.visit('/concepts');
    });

    it('Displays a valid page', () => {
      cy.contains('No concepts defined yet');

      cy.contains('Create New')
        .click();

      cy.url()
        .should('include', '/concepts/new');
    });
  });

  describe('With one concept', () => {
    const concept = concepts.valid[0];

    beforeEach(() => {
      cy.useHttp();
      cy.server();
      cy.route('GET', '/api/concepts', [concept]);
      cy.visit('/concepts');
    });

    it('Has valid name column', () => {
      cy.getCy(`row:${concept.uuid}`).within(() => {
        cy.contains(concept.name)
          .click();

        cy.url()
          .should('include', `/concepts/${concept.uuid}`);
      });
    });

    it('Has valid actions column', () => {
      cy.getCy(`row:${concept.uuid}`).within(() => {

        cy.getCy('button:concept.delete');
        cy.getCy('button:concept.open')
          .click();

        cy.url()
          .should('include', `/concepts/${concept.uuid}`);
      });
    });
  });
});
