/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';
import { DriveScopes } from '~/src/api/googleDrive/types';

export const createUrl = (base: string, query: Record<string, number | string | boolean>): string => {
  const queryString = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value || '')}`)
    .join('&');

  return `${base}?${queryString}`;
};

export const getOfflineOAuth2Url = (overrides: Record<string, string> = {}): string => {
  const base = 'https://accounts.google.com/o/oauth2/v2/auth';
  const query = {
    access_type: 'offline',
    client_id: process.env.VUE_APP_GOOGLE_DRIVE_CLIENT_ID || '',
    include_granted_scopes: true,
    prompt: 'consent',
    redirect_uri: process.env.GOOGLE_DRIVE_REDIRECT_URL || '',
    response_type: 'code',
    scope: [DriveScopes.DRIVE__FILE].join(' '),
    ...overrides,
  };

  return createUrl(base, query);
};

export const getOfflineAuthCodeUrl = (overrides: Record<string, string> = {}): string => {
  const base = 'https://oauth2.googleapis.com/token';
  const query = {
    code: '',
    access_type: 'offline',
    client_id: process.env.VUE_APP_GOOGLE_DRIVE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET || '',
    redirect_uri: process.env.GOOGLE_DRIVE_REDIRECT_URL || '',
    grant_type: 'authorization_code',
    ...overrides,
  };

  if (!query.client_secret) {
    throw new Error('clientSecret is not defined.');
  }

  return createUrl(base, query);
};

export const getOfflineRefreshTokenUrl = (overrides: Record<string, string> = {}): string => {
  const base = 'https://oauth2.googleapis.com/token';
  const query = {
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '',
    client_id: process.env.VUE_APP_GOOGLE_DRIVE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET || '',
    redirect_uri: process.env.GOOGLE_DRIVE_REDIRECT_URL || '',
    grant_type: 'refresh_token',
    ...overrides,
  };

  if (!query.client_secret) {
    throw new Error('clientSecret is not defined.');
  }

  return createUrl(base, query);
};

export const getOfflineAccessToken = async (overrides: Record<string, string> = {}): string => {
  const url = getOfflineRefreshTokenUrl(overrides);

  const response = await axios.post(url);

  return response.data.access_token;
};
