/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import dayjs from 'dayjs';
import { folders, media, projects } from '../../../../tests/mocks/models';

describe('/folders/:uuid', () => {
  const today = dayjs().format('YYYY-MM-DD');
  const now = Date.now();
  // const [year, month, day] = today.split('-').map(Number);

  // Ensure another day has 2 digits
  // const anotherDay = day >= 28 ? (day - 1) : (day + 1);
  // const targetDate = dayjs(new Date([year, month, anotherDay].map(String).join('-'))).format('YYYY-MM-DD');
  const targetDate = today;

  describe('Creating a new folder', () => {
    const folder = {
      uuid: null,
      name: 'assets/alinatrifan.sheffield',
      description: 'My Description',
      projects: [projects.valid[0].uuid],
      tags: [],
      type: 'IMAGE',
      date: targetDate,
      public: true,
      featured: false,
      created: 0,
    };

    const medium = {
      uuid: '8de15315-0719-4ae4-96b9-40cdfd1145fc',
      folder: '1f95737a-0344-4791-8680-02de5af82a7d',
      file: {
        id: '',
      },
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
      created: 0,
    };

    beforeEach(() => {
      cy.useHttp();
      cy.server();
      cy.route('GET', '/api/folders/**', {}).as('folders/get');
      cy.route('POST', '/api/folders', {}).as('folders/post');
      cy.route('DELETE', '/api/folders/**', {}).as('folders/delete');

      cy.route('GET', '/api/media', {}).as('media/get');
      cy.route('POST', '/api/media/**/upload', {}).as('media/upload');
      cy.route('POST', '/api/media', {}).as('media/post');
      cy.route('DELETE', '/api/media/**', {}).as('media/delete');

      cy.route('GET', '/api/projects', projects.valid).as('projects/get');

      cy.visit('/folders/new');
    });


    it('Happy path', () => {

      cy.wait('@projects/get');

      cy.getFile('assets/alinatrifan.sheffield.jpg', 'image/jpeg')
        .then((value) => {
          cy.get('.dropzone')
            .trigger('dagover')
            .trigger('drop', { dataTransfer: value.dataTransfer });
        });

      cy.getCy('field:folder.name')
        .contains('assets/alinatrifan.sheffield');

      cy.getCy('field:folder.description')
        .should('have.value', '')
        .click()
        .type(folder.description)
        .should('have.value', folder.description);

      cy.getCy('field:folder.type')
        .should('have.value', folder.type);

      cy.phoSelect('field:folder.type', ['VIDEO']);
      cy.phoSelect('field:folder.type', [folder.type]);

      cy.phoSelect('field:folder.projects', [projects.valid[0].uuid], true);

      cy.getCy('field:folder.date')
        .should('have.value', dayjs().format('YYYY-MM-DD'))
        .click();

      cy.getCy('field:folder.public')
        .click();

      cy.getCy('field:folder.featured')
        .click()
        .click();

      cy.getCy('button:folder.save')
        .click();

      cy.wait('@folders/post')
        .then((xhr) => {
          if (typeof xhr.request.body === 'string') {
            throw new Error('Invalid body');
          }
          folder.uuid = xhr.request.body.uuid;
          folder.created = xhr.request.body.created;

          medium.folder = folder.uuid;
          expect(xhr.request.body).to.deep.equal(folder);
          expect(folder.created).to.be.greaterThan(now);
          cy.url()
            .should('include', `/folders/${folder.uuid}`);
        });

      cy.getCy('medium.card');

      cy.getCy('button:medium.download')
        .should('not.exist');

      cy.getCy('button:medium.upload')
        .click();

      cy.wait('@media/post')
        .then((xhr) => {
          if (typeof xhr.request.body === 'string') {
            throw new Error('Invalid body');
          }

          medium.uuid = xhr.request.body.uuid;
          medium.created = xhr.request.body.created;
          expect(xhr.request.body).to.be.deep.equal(medium);
          expect(medium.created).to.be.greaterThan(now);
        });

      cy.wait('@media/upload');

      cy.getCy('button:medium.download');

      cy.getCy('button:medium.remove')
        .click();

      cy.wait('@media/delete');

      cy.getCy('medium.card')
        .should('not.exist');

      cy.getCy('button:folder.remove')
        .click();

      cy.wait('@folders/delete');
    });

    it('Allows users to delete a medium before it has been uploaded', () => {
      cy.wait('@projects/get');

      cy.getFile('assets/alinatrifan.sheffield.jpg', 'image/jpeg')
        .then((value) => {
          cy.get('.dropzone')
            .trigger('dagover')
            .trigger('drop', { dataTransfer: value.dataTransfer });
        });

      cy.getCy('button:medium.remove')
        .click();

      cy.getCy('medium.card')
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
          cy.getCy('field:folder.date')
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
          cy.getCy('field:folder.date')
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
          cy.getCy('field:folder.date')
            .invoke('val', value)
            .should((input) => {
              expect(input.get(0).checkValidity()).to.be.equal(true);
            });
        });
    });

  });

  describe('With one folder', () => {
    const folder = folders.valid[0];

    beforeEach(() => {
      cy.useHttp();
      cy.server();

      cy.route('GET', `/api/folders/${folder.uuid}`, folder).as('folders/get');
      cy.route('GET', '/api/media', media.valid).as('media/get');
      cy.route('GET', '/api/projects', projects.valid).as('projects/get');

      cy.visit(`/folders/${folder.uuid}`);
    });

    it('Displays a valid page', () => {
      cy.wait('@folders/get');
      cy.wait('@media/get');
      cy.wait('@projects/get');

      cy.getCy('field:folder.name').contains(folder.name);
      cy.getCy('field:folder.description').should('have.value', folder.description);
      cy.getCy('field:folder.type').should('have.value', folder.type);
      cy.getCy('field:folder.projects').should('have.deep.value', folder.projects.join(','));
      cy.getCy('field:folder.date').should('have.value', folder.date);
    });
    it('Reroutes to folders', () => {
      cy.wait('@folders/get');
      cy.wait('@media/get');
      cy.wait('@projects/get');

      cy.getCy('button:medium.remove').click();
      cy.url()
        .should('include', '/folders');
    });
  });

  describe('Without projects', () => {
    const folder = folders.valid[0];

    beforeEach(() => {
      cy.useHttp();
      cy.server();

      cy.route('GET', `/api/folders/${folder.uuid}`, folder).as('folders/get');
      cy.route('GET', '/api/media', media.valid).as('media/get');
      cy.route('GET', '/api/projects', []).as('projects/get');

      cy.visit(`/folders/${folder.uuid}`);
    });

    it('Doesn\'t display \'Projects\' if thet are not defined', () => {
      cy.wait('@folders/get');
      cy.wait('@media/get');
      cy.wait('@projects/get');

      cy.getCy('field:folder.projects')
        .should('not.exist');

    });
  });
});
