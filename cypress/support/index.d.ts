/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command attaching a file
     * to a input[type="file"] element.
     *
     * @example cy.get('input').attachFile('path/to/fixture.jpg', 'image/jpg'))
    */
   getCy(selector: string): Chainable<Element>

   getFile(path: string, mime: string): Chainable<{ file: File, dataTransfer: DataTransfer }>
   attachFile(path: string, mime: string): Chainable<Element>
   waitJson(alias: string): Chainable<Element>

   clearIntegrations(): Chainable<Element>
   useBrowser(): Chainable<Element>
   useHttp(): Chainable<Element>
   useAws(): Chainable<Element>
  }
}
