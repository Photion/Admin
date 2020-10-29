/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import { folders } from '../../../../tests/mocks/models';

describe('/folders', () => {
  describe('With no folders', () => {
    beforeEach(() => {
      cy.useHttp();
      cy.server();
      cy.route('GET', '/api/folders', []);
      cy.visit('/folders');
    });

    it('Displays a valid page', () => {
      cy.contains('No folders defined yet');

      cy.contains('Create New')
        .click();

      cy.url()
        .should('include', '/folders/new');
    });
  });

  describe('With one folder', () => {
    const folder = folders.valid[0];

    beforeEach(() => {
      cy.useHttp();
      cy.server();
      cy.route('GET', '/api/folders', [folder]);
      cy.visit('/folders');
    });

    it('Has valid name column', () => {
      cy.getCy(`row:${folder.uuid}`).within(() => {
        cy.contains(folder.name)
          .click();

        cy.url()
          .should('include', `/folders/${folder.uuid}`);
      });
    });

    it('Has valid actions column', () => {
      cy.getCy(`row:${folder.uuid}`).within(() => {

        cy.getCy('button:folder.delete');
        cy.getCy('button:folder.open')
          .click();

        cy.url()
          .should('include', `/folders/${folder.uuid}`);
      });
    });
  });
});
