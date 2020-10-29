
import { ref, computed, ComputedRef } from 'vue';

import { AbstractClient, Client } from '~/src/api/AbstractClient';
import { BrowserClient } from '~/src/api/BrowserClient';
import { HttpClient } from '~/src/api/HttpClient';
import { AwsClient } from '~/src/api/aws/client';
import { GoogleDriveClient } from '~/src/api/googleDrive';
import { secrets, save } from '~/src/state/secrets';
import { user } from '~/src/state/user';
import { router } from '~/src/vue/router';

export class Service<T> {
  name: string;
  logo: string;
  slug: string;
  description: string;
  values: T;
  ready: ComputedRef<boolean>

  constructor(props: { name: string; logo: string; slug: string; description: string; values: T }) {
    this.name = props.name;
    this.logo = props.logo;
    this.slug = props.slug;
    this.description = props.description;
    this.values = props.values;

    this.ready = computed(() => {
      return Object.values(props.values).reduce((acc: boolean, current) => acc && Boolean(current), true);
    });
  }
}

export const isDev = ref(process.env.NODE_ENV === 'development' || (window as unknown as { Cypress: boolean }).Cypress);

export const aws = new Service({
  name: 'Amazon Web Services',
  logo: '/logos/aws.svg',
  slug: 'aws',
  description: 'Use your own S3 bucket to store files; DynamoDB will be used to keep track of your metadata.',
  values: secrets.aws,
});

export const gcp = new Service({
  name: 'Google Cloud Platform',
  logo: '/logos/gcp.png',
  slug: 'gcp',
  description: 'Use Google Cloud Storage for your files; Firestore will be used to keep track of your metadata.',
  values: secrets.gcp,
});

export const googleDrive = new Service({
  name: 'Google Drive',
  logo: '/logos/googleDrive.svg',
  slug: 'googleDrive',
  description: 'Store your files on Google Drive. Google Sheet will be used as database for your metadata.',
  values: secrets.googleDrive,
});

export const browser = new Service({
  name: 'Your Browser (dev)',
  logo: '/logos/googleChrome.jpg',
  slug: 'browser',
  description: 'Developers may use their own browser memory to interact with Photion. Dev only.',
  values: {},
});


/**
 * Tracks the current client name.
 */
export const clientName = ref(window.localStorage.getItem('PHOTION_INTEGRATION') || '');

export const service = computed(() => {
  if (!clientName.value || clientName.value === 'http') {
    return null;
  }

  switch (clientName.value) {
  case 'aws':
    return aws;
  case 'googleDrive':
    return googleDrive;
  case 'http':
  default:
    return null;
  }
});

export const ready = computed(() => {
  if (clientName.value === 'http') {
    return true;
  }

  if (isDev.value && clientName.value === browser.slug) {
    return true;
  }

  return Boolean(service.value?.ready.value);
});

/**
 * Tracks the current client.
 */
export const api = computed((): AbstractClient => {
  if (clientName.value === aws.slug) {
    return new AwsClient({
      username: user.name,
      ...secrets.aws,
    });
  }

  if (clientName.value === browser.slug) {
    return new BrowserClient();
  }

  if (clientName.value === googleDrive.slug) {
    return new GoogleDriveClient();
  }

  return new HttpClient();
});

export const client = computed((): Client<AbstractClient> => {
  const client = new Client(api.value);

  return client;
});

export const saveClient = async (slug: string, redirect = true) => {
  window.localStorage.setItem('PHOTION_INTEGRATION', slug);
  clientName.value = slug;
  await save();

  if (redirect) {
    router.push('/');
  }
};


export const appLoaded = ref(false);
