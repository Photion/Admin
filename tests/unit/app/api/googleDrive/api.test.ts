/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';

import { DriveScopes } from '~/src/api/googleDrive/types';
import { secrets } from '~/src/state/secrets';
import {
  getOAuthUrl,
  readHashSearchString,
  createFile,
  createFolder,
  updateFile,
  downloadFile,
  deleteFile,
  searchFiles,
} from '~/src/api/googleDrive/api';

describe('unit.app.api.googleDrive.api', () => {
  const client_id = '12345';
  const redirect_uri = 'https://admin.photion.app';

  beforeAll(() => {
    secrets.googleDrive.accessToken = 'a';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOAuthUrl', () => {
    [
      { scope: '' },
      { scope: DriveScopes.DRIVE__APPDATA },
      { scope: DriveScopes.DRIVE__FILE },
      { scope: DriveScopes.DRIVE__METADATA },
      { scope: Object.values(DriveScopes).join(' ') },
    ]
      .forEach(({ scope }) => {
        it('Generates an auth url with the given scope', () => {
          const actual = getOAuthUrl({ redirect_uri, client_id, scope });
          expect(actual).toMatchSnapshot();
        });
      });
  });

  describe('readHashSearchString', () => {
    [
      { url: redirect_uri, expected: {} },
      { url: redirect_uri + '?param1=1', expected: {} },
      { url: redirect_uri + '#param2=2', expected: { param2: '2' } },
      { url: redirect_uri + '?param1=1#param2=2', expected: { param2: '2' } },
      { url: redirect_uri + '?param1=1&paramq=q', expected: {} },
      { url: redirect_uri + '?param1=1&paramq=q#param2=2', expected: { param2: '2' } },
      { url: redirect_uri + '?param1=1&paramq=q#param2=2&paramt=t', expected: { param2: '2', paramt: 't' } },
      { url: redirect_uri + '#param2=1&param2=2', expected: { param2: '2' } },
    ]
      .forEach((testCase) => {
        it('Parses the hash string as it was a query string', () => {
          const actual = readHashSearchString(testCase.url);
          expect(actual).toEqual(testCase.expected);
        });
      });
  });

  describe('createFile', () => {
    it('Queries with axios', async () => {
      const expected = 'createFile';
      const metadata = {
        name: 'file',
      };

      const file = new File([], 'file');

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await createFile(metadata, file);
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe('createFolder', () => {
    it('Queries with axios', async () => {
      const expected = 'createFolder';

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await createFolder('my-folder');
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe('updateFile', () => {
    it('Queries with axios without a file', async () => {
      const expected = 'updateFile';
      const metadata = {
        name: 'file',
      };

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await updateFile('my-file-id', metadata);
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });

    it('Queries with axios with a file', async () => {
      const expected = 'updateFile';
      const metadata = {
        name: 'file',
      };
      const file = new File([], 'file');

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await updateFile('my-file-id', metadata, file);
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe('downloadFile', () => {
    it('Queries with axios asking for a blob', async () => {
      const expected = { data: 'downloadFile' };

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await downloadFile('my-file', 'blob');
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected.data);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });

    it('Queries with axios asking for a json', async () => {
      const expected = { data: 'downloadFile' };

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await downloadFile('my-file', 'json');
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected.data);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe('deleteFile', () => {
    it('Queries with axios', async () => {
      const expected = 'deleteFile';

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await deleteFile('my-folder');
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe('searchFiles', () => {
    it('Queries with axios for all files', async () => {
      const expected = { data: { files: [1, 2, 3] } };

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await searchFiles();
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected.data.files);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });

    it('Queries with axios for all files with a name', async () => {
      const expected = { data: { files: [1, 2, 3] } };

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await searchFiles('my-file-name');
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected.data.files);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });

    it('Queries with axios for all files in a parent', async () => {
      const expected = { data: { files: [1, 2, 3] } };

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await searchFiles(undefined, 'my-parent');
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected.data.files);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });

    it('Queries with axios for all files with a name in a parent', async () => {
      const expected = { data: { files: [1, 2, 3] } };

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await searchFiles('my-file-name', 'my-parent');
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected.data.files);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });

    it('Queries with axios for all files and their fields', async () => {
      const expected = { data: { files: [1, 2, 3] } };

      jest.spyOn(axios, 'request').mockImplementationOnce(() => Promise.resolve(expected));

      const actual = await searchFiles(undefined, undefined, '*');
      const mock = (axios.request as unknown as { mock: jest.MockContext<typeof axios.request, unknown[]> }).mock;

      expect(actual).toEqual(expected.data.files);
      expect(mock.calls[0][0]).toMatchSnapshot();
    });

  });


});
