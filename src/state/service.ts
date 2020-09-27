
import { ref, computed, ComputedRef } from '@vue/composition-api';

import { AbstractClient } from '~/src/api/AbstractClient';
import { HttpClient } from '~/src/api/HttpClient';
import { AwsClient } from '~/src/api/aws/AwsClient';
import { secrets } from '~/src/state/secrets';
import { user } from '~/src/state/user';


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
  case 'http':
  default:
    return null;
  }
});

export const ready = computed(() => {
  if (clientName.value === 'http') {
    return true;
  }

  return Boolean(service.value?.ready.value);
});

/**
 * Tracks the current client.
 */
export const client = computed((): AbstractClient => {
  if (clientName.value === 'aws') {
    return new AwsClient({
      username: user.name,
      ...secrets.aws,
    });
  }

  return new HttpClient();
});

export const appLoaded = ref(false);
