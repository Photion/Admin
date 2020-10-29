/* eslint-disable @typescript-eslint/camelcase */
import axios, { Method } from 'axios';

import {
  DriveFileMetadata,
  DriveScopes,
  DrivePaths,
  DriveFile,
} from '~/src/api/googleDrive/types';
import { CollectionSchema } from '~/src/models/schema';
import { save, secrets } from '~/src/state/secrets';

/** Photion DB file name  */
export const PHOTION_DB_FILENAME = 'photion.json';

/** Photion DB default schema */
export const PHOTION_DB_SCHEMA: CollectionSchema = {
  folders: {},
  media: {},
  projects: {},
};

/**
 * Returns the OAuth2 URL to which
 * the user should be redirected
 * to obtain an access token
 *
 * @param redirectUrl
 * @param scopes
 */
export const getOAuthUrl = (overrides: Record<string, string> = {}) => {
  const query = {
    response_type: 'token',
    client_id: process.env.VUE_APP_GOOGLE_DRIVE_CLIENT_ID,
    redirect_uri: `${window.location.protocol}//${window.location.host}/services/googleDrive`,
    scope: [DriveScopes.DRIVE__FILE].join(' '),
    state: '',
    ...overrides,
  };

  const queryString = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value || '')}`)
    .join('&');

  return `${DrivePaths.OAUTH2}?${queryString}`;
};

/**
 * Reads the hash-search-string, i.e.
 * #access_token=abc&expires_in=3600
 *
 * @param url
 */
export const readHashSearchString = (url: string) => {
  const { hash, origin } = new URL(url);
  const parsed = new URL(`${origin}${hash.replace('#', '?')}`);

  return Object.fromEntries([...parsed.searchParams.entries()]);
};

/**
 * Queries the Google Drive API via Axios
 *
 * @param path
 * @param method
 * @param data
 * @param config
 */
export const query = async (
  path: string,
  method: Method = 'GET',
  data?: Record<string, unknown> | FormData,
  config?: Record<string, unknown>,
) => {
  if (!secrets.googleDrive.accessToken) {
    throw new Error('Trying to query Google Drive API without Access Token!');
  }

  const headers = {
    Authorization: `Bearer ${secrets.googleDrive.accessToken}`,
  };

  const response = await axios.request({
    url: `${DrivePaths.API}${path}`,
    method,
    data,
    headers,
    ...config,
  });

  return response;
};

/**
 * Creates a file
 * on Google Drive
 *
 * @param metadata
 * @param file
 */
export const createFile = async (metadata: DriveFileMetadata, file?: File) => {
  const data = new FormData();

  const meta = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

  data.append('metadata', meta);

  if (file) {
    data.append('media', file);
  }

  const response = await query('/upload/drive/v3/files?uploadType=multipart', 'POST', data);

  return response;
};

/**
 * Creates a folder
 * on Google Drive
 *
 * @param name
 * @param parents
 */
export const createFolder = async (name: string, parents: string[] = []) => {
  const metadata = {
    name,
    parents,
    mimeType: 'application/vnd.google-apps.folder',
  };

  return createFile(metadata);
};

/**
 * Updates a file
 * on Google Drive
 *
 * @param fileId
 * @param metadata
 * @param file
 */
export const updateFile = async (fileId: string, metadata: DriveFileMetadata, file?: File) => {
  let path = `/drive/v2/files/${fileId}?uploadType=multipart`;

  const data = new FormData();

  const meta = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

  data.append('metadata', meta);

  if (file) {
    path = `/upload/drive/v2/files/${fileId}?uploadType=multipart`;
    data.append('media', file);
  }

  const response = await query(path, 'PUT', data);

  return response;
};

/**
 * Downloads a file (binary)
 * from Google Drive
 *
 * @param fileId
 * @param type
 */
export const downloadFile = async <T = string>(fileId: string, type = 'blob'): Promise<T> => {
  const path = `/drive/v2/files/${fileId}?alt=media`;
  const response = await query(path, 'GET', {}, { responseType: type });

  return response.data;
};

/**
 * Deletes a file (skips the trash)
 * from Google Drive
 *
 * @param fileId
 */
export const deleteFile = async (fileId: string) => {
  const path = `/drive/v2/files/${fileId}`;

  return query(path, 'DELETE');
};

export const headFile = async (fileId: string) => {
  const path = `/drive/v3/files/${fileId}?fields=*`;

  try {
    const response = await query(path);
    return response;
  } catch {
    return null;
  }
};

/**
 * Searches files
 * on Google Drive
 *
 * @param name
 * @param parent
 * @param fields
 */
export const searchFiles = async (name?: string, parent?: string, fields?: string): Promise<DriveFile[]> => {
  const path = '/drive/v3/files';
  const queries = [];

  if (name) {
    queries.push(`name='${name}'`);
  }

  if (parent) {
    queries.push(`'${parent}' in parents`);
  }

  const q = queries.join(' and ');

  const params: Record<string, string> = { q };

  if (fields) {
    params.fields = fields;
  }

  const response = await query(path, 'GET', undefined, { params });

  return response.data.files;
};

/**
 * Creates the Photion Root Folder
 * on Google Drive
 *
 * NB: Calling this function WILL NOT
 * check for duplicates. Use `getRootFolder`
 * to check for duplicates
 *
 * @returns The `fileId` of the folder
 */
export const createRootFolder = async (): Promise<string> => {
  const response = await createFolder('photion');
  secrets.googleDrive.rootFolderId = response.data.id;

  await save();

  return response.data.id;
};

/**
 * Returns the Photion Root Folder,
 * creating it if it is not found.
 *
 * @param ensure Checks whether the folder is actually there
 * @returns The `fileId` of the folder
 */
export const getRootFolder = async (ensure = false): Promise<string> => {
  if (secrets.googleDrive.rootFolderId) {
    if (ensure) {
      const exists = await headFile(secrets.googleDrive.rootFolderId);

      if (exists) {
        return secrets.googleDrive.rootFolderId;
      }
    }
    return secrets.googleDrive.rootFolderId;
  }

  const existing = await searchFiles('photion', 'root');

  if (existing.length) {
    secrets.googleDrive.rootFolderId = existing[0].id;

    await save();

    return existing[0].id;
  }

  return await createRootFolder();
};

/**
 * Creates the Photion Database
 * on Google Drive
 *
 * NB: Calling this function WILL NOT
 * check for duplicates. Use `getDb`
 * to check for duplicates
 *
 * @returns The `fileId` of the database
 */
export const createDb = async (): Promise<string> => {
  const parent = await getRootFolder();

  const metadata = {
    name: PHOTION_DB_FILENAME,
    parents: [parent],
    mimeType: 'application/json',
  };

  const contents = JSON.stringify(PHOTION_DB_SCHEMA);
  const file = new File([contents], PHOTION_DB_FILENAME, { type: 'application/json' });

  const response = await createFile(metadata, file);

  secrets.googleDrive.databaseId = response.data.id;
  await save();

  return response.data.id;
};

/**
 * Returns the Photion Database,
 * creating it if it is not found.
 *
 * @param ensure Checks whether the database is actually there
 * @returns The `fileId` of the database
 */
export const getDb = async (ensure = false): Promise<string> => {
  if (secrets.googleDrive.databaseId) {
    if (ensure) {
      const exists = await headFile(secrets.googleDrive.databaseId);

      if (exists) {
        return secrets.googleDrive.databaseId;
      }
    } else {
      return secrets.googleDrive.databaseId;
    }
  }

  const parent = await getRootFolder();
  const existing = await searchFiles(PHOTION_DB_FILENAME, parent);

  if (existing.length) {
    secrets.googleDrive.databaseId = existing[0].id;
    await save();

    return existing[0].id;
  }

  return await createDb();
};

/**
 * Updates the Photion Database
 *
 * @param db
 * @returns The `fileId` of the database
 */
export const updateDb = async (db: CollectionSchema): Promise<string> => {
  const parent = await getRootFolder();
  const databaseId = await getDb();

  const metadata = {
    name: PHOTION_DB_FILENAME,
    parents: [parent],
    mimeType: 'application/json',
  };

  const contents = JSON.stringify(db);
  const file = new File([contents], PHOTION_DB_FILENAME, { type: 'application/json' });

  const response = await updateFile(databaseId, metadata, file);

  return response.data.id;
};

export const clearGoogleDrive = async () => {
  try {
    await deleteFile(secrets.googleDrive.rootFolderId);
  } catch(error) {
    // We don't really care about this error
    // which is most likely double deletion
  }
};
