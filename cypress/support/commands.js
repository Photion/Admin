// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getCy', (selector) => {
  cy.get(`[data-cy="${selector}"]`);
});

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

Cypress.Commands.add('attachFile', { prevSubject: 'element' }, (el, path, mime) => {
  cy.getFile(path, mime)
    .then(({ dataTransfer }) => {
      el[0].files = dataTransfer.files;
      return el;
    });
});


Cypress.Commands.add('waitJson', (alias) => {
  cy.wait(alias).then((xhr) => {
    return xhr.request.body;
  });
});

Cypress.Commands.add('clearIntegrations', () => {
  window.sessionStorage.removeItem('PHOTION_USERNAME');
  window.sessionStorage.removeItem('PHOTION_SESSION_CREDENTIALS');
});


Cypress.Commands.add('useHttp', () => {
  window.sessionStorage.setItem('PHOTION_USERNAME', Cypress.env('USERNAME'));
  window.localStorage.setItem('PHOTION_INTEGRATION', 'http');
});

Cypress.Commands.add('useAws', () => {
  window.localStorage.setItem('PHOTION_INTEGRATION', 'aws');
  window.sessionStorage.setItem('PHOTION_USERNAME', Cypress.env('USERNAME'));
  window.sessionStorage.setItem('PHOTION_SESSION_CREDENTIALS', Cypress.env('SESSION_CREDENTIALS_AWS'));
});
