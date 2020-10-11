import * as fs from 'fs';
import * as path from 'path';

import sinon from 'sinon';

import { Fragment } from '~/src/models/Fragment';
import { MIME_OPTIONS } from '~/src/files/metadata';


const getInstance = (props = {}) => {
  const fragment = new Fragment({
    concept: 'concept',
    ...props,
  });

  return fragment;
};

const pixel = fs.readFileSync(path.join(__dirname, '../../fixtures/images/1pixel.jpeg'));

const getFile = () => {
  const blob = new Blob([pixel], { type: 'image/jpeg' });
  const file = new File([blob], 'filename', { type: 'image/jpeg' });

  return file;
};

describe('unit.models.Fragment', () => {

  afterEach(() => sinon.restore());

  describe('constructor', () => {
    it('Creates a Fragment', () => {
      const fragment = getInstance();
      expect(fragment.constructor.name).toEqual('Fragment');
    });
  });

  describe('setFile', () => {
    it('Stores the file', async () => {
      const fragment = getInstance();
      const file = getFile();

      await fragment.setFile(file);

      expect(fragment.file).toEqual(file);
    });

    it('Sets the metadata', async () => {
      const fragment = getInstance();
      const file = getFile();

      await fragment.setFile(file);

      expect(fragment.meta.filename).toEqual(file.name);
      expect(fragment.meta.size).toEqual(file.size);
      expect(fragment.meta.mime).toEqual(file.type);
    });

    it('Sets the data', async () => {
      const fragment = getInstance();
      const file = getFile();
      const expected = `data:${file.type};base64,${pixel.toString('base64')}`;

      await fragment.setFile(file);

      expect(fragment.data).toEqual(expected);
    });
  });

  describe('hasPreview', () => {

    describe('Has preview with a supported mime', () => {
      Object.keys(MIME_OPTIONS).forEach((mime) => {
        it(`Mime: '${mime}'`, () => {
          const fragment = new Fragment({ concept: 'abc' });
          fragment.meta.mime = mime;

          expect(fragment.hasPreview).toEqual(true);
        });
      });
    });

    describe('No preview with unsupported mime', () => {
      ['application/json', 'application/xml', 'random'].forEach((mime) => {
        it(`Mime: '${mime}'`, () => {
          const fragment = new Fragment({ concept: 'abc' });
          fragment.meta.mime = mime;

          expect(fragment.hasPreview).toEqual(false);
        });
      });
    });
  });
});
