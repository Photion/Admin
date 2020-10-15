/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

describe('/services/aws', () => {
  const user = {
    name: 'cypress.user',
    password: 'cypress.password',
  };

  const secrets = {
    aws: {
      region: 'eu-west-1',
      accessKeyId: 'cypress.aws.accessKeyId',
      secretAccessKey: 'cypress.aws.secretAccessKey',
    },
  };

  const encrypted = '{"meta":{"key":"PHOTION_ENCRYPTION_STORAGE_KEY","serializer":"LocalStorageHandler","version":1,"datetime":1601216799928},"payload":"46dc8fd5e8a7c1741f720752MlATAP4Zj1SRVKGO6U1KHqwgnRCMaSnM+s3l4YgjFaaJjx0+hKGLsSsH1iT0VKAYhXrZsFzCusd4gGLs3x23xxVU9II1kykIbvMDhCln3SgX454Wd/ZxTzDfjDTL/3HqaNtOfrLjmZYs75g+7GlxBWVHmMWDCZhVn0XcDgFzb9GDIQjwasoGKSroRTzOUS6yw52OmH4ojL2QIekSH0Y41pMG1M9hQKRNfQ=="}';

  describe('Without sessionStorage data', () => {
    beforeEach(() => {
      window.localStorage.removeItem('PHOTION_INTEGRATION');
      window.sessionStorage.removeItem('PHOTION_USERNAME');

      cy.visit('/services/aws');
    });

    it('Displays a valid page', () => {
      cy.getCy('field:user.name');
      cy.getCy('field:user.password');

      cy.getCy('integration:aws')
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

      Object.entries(secrets.aws).forEach(([key, value]) => {
        cy.getCy(`field:secrets.aws.${key}`)
          .type(value);
      });

      cy.getCy('button:service.continue')
        .click()
        .then(() => {
          const credentials = JSON.parse(window.sessionStorage.getItem('PHOTION_SESSION_CREDENTIALS'));

          expect(Boolean(credentials && credentials.aws)).to.be.true;
          expect(credentials.aws.region).to.be.equal(secrets.aws.region);
          expect(credentials.aws.accessKeyId).to.be.equal(secrets.aws.accessKeyId);
          expect(credentials.aws.secretAccessKey).to.be.equal(secrets.aws.secretAccessKey);
        });
    });

  });

  describe('With sessionStorage data', () => {
    beforeEach(() => {
      window.sessionStorage.setItem('PHOTION_USERNAME', user.name);
      window.sessionStorage.setItem('PHOTION_SESSION_CREDENTIALS', JSON.stringify(secrets));

      cy.visit('/services/aws');
    });

    it('Restores the credentials from session storage', () => {
      cy.getCy('field:user.name')
        .should('have.value', user.name);

      cy.getCy('field:user.password')
        .should('have.value', '');

      Object.entries(secrets.aws).forEach(([key, value]) => {
        cy.getCy(`field:secrets.aws.${key}`)
          .should('have.value', value);
      });

    });
  });

  describe('With encrypted localStorage data', () => {
    beforeEach(() => {
      window.sessionStorage.removeItem('PHOTION_USERNAME');
      window.sessionStorage.removeItem('PHOTION_SESSION_CREDENTIALS');
      window.localStorage.setItem('PHOTION_ENCRYPTION_STORAGE_KEY', encrypted);

      cy.visit('/services/aws');
    });

    it('Soft fails decryption with unmatched credentials', () => {
      cy.getCy('field:user.name')
        .type('AnotherUser');

      cy.getCy('field:user.password')
        .type('Password');

      Object.keys(secrets.aws).forEach((key) => {
        cy.getCy(`field:secrets.aws.${key}`)
          .should('have.value', '');
      });

    });

    it('Decrypts once username and password match', () => {
      cy.getCy('field:user.name')
        .type(user.name);

      cy.getCy('field:user.password')
        .type(user.password);

      Object.entries(secrets.aws).forEach(([key, value]) => {
        cy.getCy(`field:secrets.aws.${key}`)
          .should('have.value', value);
      });

    });
  });

});
