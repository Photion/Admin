import { TextDecoder } from 'util';

import crypto from '@trust/webcrypto';
import TextEncoding from 'text-encoding-utf-8';

import * as googleDrive from '~/src/api/googleDrive';
import { secrets } from '~/src/state/secrets';
import { getOfflineAccessToken } from '~/tests/utils/googleDrive';

const createFile = (content = {}) => {
  const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
  const file = new File([blob], 'file.json');

  return file;
};

describe('feat.api.googleDrive', () => {

  beforeAll(async () => {
    global.crypto = crypto;
    (global.TextEncoder as unknown) = TextEncoding.TextEncoder;
    (global.TextDecoder as unknown) = TextDecoder;

    secrets.googleDrive.accessToken = await getOfflineAccessToken();
  });

  afterEach(async () => {
    await googleDrive.clearGoogleDrive();
    secrets.googleDrive.rootFolderId = '';
    secrets.googleDrive.databaseId = '';
  });

  describe('api calls', () => {
    it('Uploads a file and deletes a file', async () => {
      const metadata = {
        name: 'file.json',
      };

      const createRequest = await googleDrive.createFile(metadata, createFile());

      const headRequest1 = await googleDrive.headFile(createRequest.data.id);
      expect(Boolean(headRequest1)).toEqual(true);

      await googleDrive.deleteFile(createRequest.data.id);

      const headRequest2 = await googleDrive.headFile(createRequest.data.id);
      expect(Boolean(headRequest2)).toEqual(false);
    });
  });

  describe('GoogleDriveClient', () => {

    describe('Sustains two concurrent GoogleDriveClients', () => {

      it('Create doesn\'t overwrite', async () => {
        const client1 = new googleDrive.GoogleDriveClient();
        const client2 = new googleDrive.GoogleDriveClient();

        await client1.create('concepts', { uuid: 'concept-1', data: 'abc' });
        await client2.create('concepts', { uuid: 'concept-2', data: 'def' });

        expect(client2.db).toMatchSnapshot();
      }, 20 * 1000);
    });

    describe('Retrieves a saved entity', () => {

      it('Creates with one client, retrieves with another', async () => {
        const client1 = new googleDrive.GoogleDriveClient();
        await client1.create('concepts', { uuid: 'concept-1', data: 'abc' });

        const client2 = new googleDrive.GoogleDriveClient();
        const concept = await client2.retrieve('concepts', 'concept-1');

        expect(concept).toMatchSnapshot();

      }, 20 * 1000);
    });
  });

});
