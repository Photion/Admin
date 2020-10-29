/* eslint-disable @typescript-eslint/camelcase */
/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import { getOfflineAccessToken } from '../../../../tests/utils/googleDrive';

describe('/services/googleDrive', () => {

  const timeout = 10 * 1000;

  describe('Landing', () => {
    beforeEach(() => {
      cy.clearIntegrations();
      cy.visit('/services/googleDrive');
    });

    it('Can navigate back to the `/services` page', () => {
      cy.getCy('integration:googleDrive')
        .contains('Back to all services')
        .click();

      cy.location('pathname')
        .should('eq', '/services');
    });

    it('Can navigate to the Google Drive OAuth2 page', () => {
      cy.getCy('button:googleDrive.authorize')
        .then((value) => {
          const href = value[0].getAttribute('href');
          [
            'https://accounts.google.com/o/oauth2/v2/auth',
            '?client_id=',
            '&redirect_uri=',
            '&scope=',
            '&state=',
          ]
            .forEach((substring) => {
              href.includes(substring);
            });
        });
    });
  });

  describe('Auth workflow', () => {
    let accessToken = '';

    const getUrl = (redirect = true) => {
      let url = `/services/googleDrive#access_token=${accessToken}&token_type=Bearer&expires_in=3600`;

      if (!redirect) {
        url = `${url}&state=noredirect`;
      }

      return url;
    };

    before(function() {
      const client_id = Cypress.env('VUE_APP_GOOGLE_DRIVE_CLIENT_ID');
      const client_secret = Cypress.env('GOOGLE_DRIVE_CLIENT_SECRET');
      const redirect_url = Cypress.env('GOOGLE_DRIVE_REDIRECT_URL');
      const refresh_token = Cypress.env('GOOGLE_DRIVE_REFRESH_TOKEN');

      if (!(client_id && client_secret && redirect_url && refresh_token)) {
        this.skip();
      } else {
        cy.visit('/').then(async () => {
          accessToken = await getOfflineAccessToken({
            client_id: Cypress.env('VUE_APP_GOOGLE_DRIVE_CLIENT_ID'),
            client_secret: Cypress.env('GOOGLE_DRIVE_CLIENT_SECRET'),
            redirect_url: Cypress.env('GOOGLE_DRIVE_REDIRECT_URL'),
            refresh_token: Cypress.env('GOOGLE_DRIVE_REFRESH_TOKEN'),
          });
        });
      }
    });

    beforeEach(() => {
      cy.clearIntegrations();
    });

    it('Logs in and redirects to the home', () => {
      cy.visit(getUrl());

      cy.location('pathname', { timeout })
        .should('equal', '/');

      cy.get('a' );

      cy.getCy('card:index.folders');
      cy.getCy('card:index.services');
    });

    it('Logs in but doesn\'t redirect to the home and shows the state page', () => {
      cy.visit(getUrl(false));

      cy.getCy('field:secrets.googleDrive.accessToken', { timeout })
        .should('have.value', accessToken);

      cy.getCy('table:googleDrive.files');

      cy.getCy('field:secrets.googleDrive.rootFolderId')
        .invoke('val')
        .then((value) => {
          cy.getCy(`row:googleDrive.files:${value}`);
        });

      cy.getCy('field:secrets.googleDrive.databaseId')
        .invoke('val')
        .then((value) => {
          cy.getCy(`row:googleDrive.files:${value}`)
            .within(() => {
              cy.getCy('button:googleDriveFile.delete')
                .click();

              cy.getCy(`row:googleDrive.files:${value}`)
                .should('not.exist');
            });
        });
    });

    it('Disconnects from Google Drive', () => {
      cy.visit(getUrl(false));

      cy.getCy('button:googleDrive.disconnect', { timeout })
        .click();

      cy.location('pathname')
        .should('equal', '/services/googleDrive');

      cy.getCy('button:googleDrive.authorize');
    });

  });

});
