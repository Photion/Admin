/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import dayjs from 'dayjs';
import { concepts, fragments, projects } from '../../../../tests/mocks/models';

describe('/concepts/:uuid', () => {
  const today = dayjs().format('YYYY-MM-DD');
  // const [year, month, day] = today.split('-').map(Number);

  // Ensure another day has 2 digits
  // const anotherDay = day >= 28 ? (day - 1) : (day + 1);
  // const targetDate = dayjs(new Date([year, month, anotherDay].map(String).join('-'))).format('YYYY-MM-DD');
  const targetDate = today;

  describe('Creating a new concept', () => {
    const concept = {
      uuid: null,
      name: 'assets/alinatrifan.sheffield',
      description: 'My Description',
      projects: [projects.valid[0].uuid],
      tags: [],
      type: 'IMAGE',
      date: targetDate,
      public: true,
      featured: false,
    };

    const fragment = {
      uuid: '8de15315-0719-4ae4-96b9-40cdfd1145fc',
      concept: '1f95737a-0344-4791-8680-02de5af82a7d',
      fileId: '',
      meta: {
        filename: 'assets/alinatrifan.sheffield.jpg',
        mime: 'image/jpeg',
        size: 201256,
        public: false,
        storage: 'PREVIEW',
        tags: {
          'Bits Per Sample': {
            'value': 8,
            'description': '8',
          },
          'Image Height': {
            'value': 853,
            'description': '853px',
          },
          'Image Width': {
            'value': 1280,
            'description': '1280px',
          },
          'Color Components': {
            'value': 3,
            'description': '3',
          },
          'Subsampling': {
            'value': [
              [
                1,
                17,
                0,
              ],
              [
                2,
                17,
                1,
              ],
              [
                3,
                17,
                1,
              ],
            ],
            'description': 'YCbCr4:4:4 (1 1)',
          },
        },
        date: null,
      },
      notes: '',
    };

    beforeEach(() => {
      cy.useHttp();
      cy.server();
      cy.route('GET', '/api/concepts/**', {}).as('concepts/get');
      cy.route('POST', '/api/concepts', {}).as('concepts/post');
      cy.route('DELETE', '/api/concepts/**', {}).as('concepts/delete');

      cy.route('GET', '/api/fragments', {}).as('fragments/get');
      cy.route('POST', '/api/fragments/**/upload', {}).as('fragments/upload');
      cy.route('POST', '/api/fragments', {}).as('fragments/post');
      cy.route('DELETE', '/api/fragments/**', {}).as('fragments/delete');

      cy.route('GET', '/api/projects', projects.valid).as('projects/get');

      cy.visit('/concepts/new');
    });


    it('Happy path', () => {

      cy.wait('@projects/get');

      cy.getFile('assets/alinatrifan.sheffield.jpg', 'image/jpeg')
        .then((value) => {
          cy.get('.dropzone')
            .trigger('dagover')
            .trigger('drop', { dataTransfer: value.dataTransfer });
        });

      cy.getCy('field:concept.name')
        .contains('assets/alinatrifan.sheffield');

      cy.getCy('field:concept.description')
        .should('have.value', '')
        .click()
        .type(concept.description)
        .should('have.value', concept.description);

      cy.getCy('field:concept.type')
        .should('have.value', concept.type);

      cy.phoSelect('field:concept.type', ['VIDEO']);
      cy.phoSelect('field:concept.type', [concept.type]);

      cy.phoSelect('field:concept.projects', [projects.valid[0].uuid], true);

      cy.getCy('field:concept.date')
        .should('have.value', dayjs().format('YYYY-MM-DD'))
        .click();

      cy.getCy('field:concept.public')
        .click();

      cy.getCy('field:concept.featured')
        .click()
        .click();

      cy.getCy('button:concept.save')
        .click();

      cy.wait('@concepts/post')
        .then((xhr) => {
          if (typeof xhr.request.body === 'string') {
            throw new Error('Invalid body');
          }

          concept.uuid = xhr.request.body.uuid;
          fragment.concept = concept.uuid;
          expect(xhr.request.body).to.deep.equal(concept);
          cy.url()
            .should('include', `/concepts/${concept.uuid}`);
        });

      cy.getCy('fragment.card');

      cy.getCy('button:fragment.download')
        .should('not.exist');

      cy.getCy('button:fragment.upload')
        .click();

      cy.wait('@fragments/post')
        .then((xhr) => {
          if (typeof xhr.request.body === 'string') {
            throw new Error('Invalid body');
          }

          fragment.uuid = xhr.request.body.uuid;
          expect(xhr.request.body).to.be.deep.equal(fragment);
        });

      cy.wait('@fragments/upload');

      cy.getCy('button:fragment.download');

      cy.getCy('button:fragment.remove')
        .click();

      cy.wait('@fragments/delete');

      cy.getCy('fragment.card')
        .should('not.exist');

      cy.getCy('button:concept.remove')
        .click();

      cy.wait('@concepts/delete');
    });

    it('Allows users to delete a fragment before it has been uploaded', () => {
      cy.wait('@projects/get');

      cy.getFile('assets/alinatrifan.sheffield.jpg', 'image/jpeg')
        .then((value) => {
          cy.get('.dropzone')
            .trigger('dagover')
            .trigger('drop', { dataTransfer: value.dataTransfer });
        });

      cy.getCy('button:fragment.remove')
        .click();

      cy.getCy('fragment.card')
        .should('not.exist');
    });

    it('Enforces the 4 characters limits for dates, with min 1900 and max 2100', () => {

      cy.wait('@projects/get');

      // Check absurd dates are resetted
      [
        '9999999-12-31',
        '-999999-01-01',
      ]
        .forEach((value) => {
          cy.getCy('field:concept.date')
            .invoke('val', value)
            .should('have.value', '');
        });

      const currentYear = (new Date()).getFullYear();
      const nextYear = currentYear + 1;

      // Check out-of-bound dates
      // are considered invalid
      [
        '1899-12-31',
        `${nextYear}-01-01`,
      ]
        .forEach((value) => {
          cy.getCy('field:concept.date')
            .invoke('val', value)
            .should((input) => {
              expect(input.get(0).checkValidity()).to.be.equal(false);
            });
        });

      // Check out-of-bound dates
      // are considered invalid
      [
        '1900-01-01',
        '1970-10-17',
        `${currentYear}-12-31`,
      ]
        .forEach((value) => {
          cy.getCy('field:concept.date')
            .invoke('val', value)
            .should((input) => {
              expect(input.get(0).checkValidity()).to.be.equal(true);
            });
        });
    });

  });

  describe('With one concept', () => {
    const concept = concepts.valid[0];

    beforeEach(() => {
      cy.useHttp();
      cy.server();

      cy.route('GET', `/api/concepts/${concept.uuid}`, concept).as('concepts/get');
      cy.route('GET', '/api/fragments', fragments.valid).as('fragments/get');
      cy.route('GET', '/api/projects', projects.valid).as('projects/get');

      cy.visit(`/concepts/${concept.uuid}`);
    });

    it('Displays a valid page', () => {
      cy.wait('@concepts/get');
      cy.wait('@fragments/get');
      cy.wait('@projects/get');

      cy.getCy('field:concept.name').contains(concept.name);
      cy.getCy('field:concept.description').should('have.value', concept.description);
      cy.getCy('field:concept.type').should('have.value', concept.type);
      cy.getCy('field:concept.projects').should('have.deep.value', concept.projects.join(','));
      cy.getCy('field:concept.date').should('have.value', concept.date);
    });
    it('Reroutes to concepts', () => {
      cy.wait('@concepts/get');
      cy.wait('@fragments/get');
      cy.wait('@projects/get');

      cy.getCy('button:fragment.remove').click();
      cy.url()
        .should('include', '/concepts');
    });
  });

  describe('Without projects', () => {
    const concept = concepts.valid[0];

    beforeEach(() => {
      cy.useHttp();
      cy.server();

      cy.route('GET', `/api/concepts/${concept.uuid}`, concept).as('concepts/get');
      cy.route('GET', '/api/fragments', fragments.valid).as('fragments/get');
      cy.route('GET', '/api/projects', []).as('projects/get');

      cy.visit(`/concepts/${concept.uuid}`);
    });

    it('Doesn\'t display \'Projects\' if thet are not defined', () => {
      cy.wait('@concepts/get');
      cy.wait('@fragments/get');
      cy.wait('@projects/get');

      cy.getCy('field:concept.projects')
        .should('not.exist');

    });
  });
});
