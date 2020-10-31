/**
 * Shorthand returning the element marked with
 * the data attribute `cy="${selector}"`.
 * All important elements should be marked
 * using a `cy` data attribute.
 *
 * @example
 * cy.getCy('my-cy-tag')
 */
Cypress.Commands.add('getCy', (selector, options = {}) => {
  cy.get(`[cy="${selector}"]`, options);
});

/**
 * Loads a fixture file into memory
 * so that it can be passed to inputs.
 *
 * @example
 * cy.getFile('path/to/fixture', 'image/png')
 *  .then(({ file, dataTransfer}) => {
 *    ...
 *  });
 */
Cypress.Commands.add('getFile', (path, mime) => {
  cy.fixture(path, 'base64')
    .then(content => Cypress.Blob.base64StringToBlob(content, mime))
    .then((blob) => {
      const file = new File([blob], path, { type: mime });
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(file);

      return { file, dataTransfer };
    });
});

/**
 * Attaches a file to a chained input element
 *
 * @example
 * cy.get('#my-file-input')
 *  .attachFile(path, mime)
 */
Cypress.Commands.add('attachFile', { prevSubject: 'element' }, (el, path, mime) => {
  cy.getFile(path, mime)
    .then(({ dataTransfer }) => {
      el[0].files = dataTransfer.files;
      return el;
    });
});

/**
 * Interacts with a PhoSelect, given a cy-based selector
 * and the array of values to set. Allows to specify
 * whether the select is multiple and therefore
 * explicit option men dismissal is required
 *
 * @example
 * cy.phoSelect('field:folder.type', ['VIDEO']);
 * cy.phoSelect('field:folder.type', [folder.type]);
 * cy.phoSelect('field:folder.projects', [projects.valid[0].uuid], true);
 */
Cypress.Commands.add('phoSelect', (selector, values, multiple = false) => {
  cy.getCy(`${selector}:trigger`)
    .click();

  values.forEach((value) => {
    cy.getCy(`${selector}:option:${value}`)
      .click();
  });

  cy.getCy(selector)
    .should('have.value', values.join(','));

  if (multiple) {
    cy.getCy(`${selector}:trigger:close`)
      .click();
  }
});

/**
 * Clears all Photion integration info
 * stored in the session storage.
 *
 * Helpful in `before` hooks to setup an integration.
 */
Cypress.Commands.add('clearIntegrations', () => {
  window.localStorage.removeItem('PHOTION_INTEGRATION');
  window.sessionStorage.removeItem('PHOTION_USERNAME');
  window.sessionStorage.removeItem('PHOTION_SESSION_CREDENTIALS');
});

/**
 * Sets the `browser` integration type
 * in the session storage.
 *
 * Helpful in `before` hooks to setup an integration.
 */
Cypress.Commands.add('useBrowser', () => {
  window.sessionStorage.setItem('PHOTION_USERNAME', Cypress.env('USERNAME'));
  window.localStorage.setItem('PHOTION_INTEGRATION', 'browser');
});

/**
 * Sets the `http` integration type
 * in the session storage.
 *
 * Helpful in `before` hooks to setup an integration.
 */
Cypress.Commands.add('useHttp', () => {
  window.sessionStorage.setItem('PHOTION_USERNAME', Cypress.env('USERNAME'));
  window.localStorage.setItem('PHOTION_INTEGRATION', 'http');
});

/**
 * Sets the `aws` integration type
 * in the session storage.
 *
 * Helpful in `before` hooks to setup an integration.
 */
Cypress.Commands.add('useAws', () => {
  const defaults = JSON.stringify({
    aws: {
      region: 'region',
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
    },
  });

  const credentials = Cypress.env('SESSION_CREDENTIALS_AWS') || defaults;

  console.log({ credentials });

  window.localStorage.setItem('PHOTION_INTEGRATION', 'aws');
  window.sessionStorage.setItem('PHOTION_USERNAME', Cypress.env('USERNAME'));
  window.sessionStorage.setItem('PHOTION_SESSION_CREDENTIALS', credentials);
});
