/**
 * Lists Google Drive OAuth2 scopes
 * used by Photion
 */
export enum DriveScopes {
  DRIVE__APPDATA = 'https://www.googleapis.com/auth/drive.appdata',
  DRIVE__FILE = 'https://www.googleapis.com/auth/drive.file',
  DRIVE__METADATA = 'https://www.googleapis.com/auth/drive.metadata',
}

/**
 * Models a File resource
 * from Google Drive
 */
export interface DriveFile {
  id: string;
  kind: string;
  mimeType: string;
  name: string;
}

/**
 * Models the file metadata
 * to be sent to Google Drive
 */
export interface DriveFileMetadata {
  name: string;
  parents?: string[];
}

/**
 * Base paths that we need
 * to interact with Google Drive
 */
export enum DrivePaths {
  API = 'https://www.googleapis.com',
  OAUTH2 = 'https://accounts.google.com/o/oauth2/v2/auth',
}
