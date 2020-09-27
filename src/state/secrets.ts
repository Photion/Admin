import { computed, reactive } from '@vue/composition-api';
import { LocalStorageHandler } from 'lucertula/storage/localStorage';
import { WebCryptoAesGcpHandler } from 'lucertula/strategy/web/aes-gcp';

import { user } from '~/src/state/user';


export interface AwsSecrets {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface GcpSecrets {
  apiKey: string;
  apiSecret: string;
}

export interface Secrets {
  aws: AwsSecrets;
  gcp: GcpSecrets;
}

export const PHOTION_ENCRYPTION_STORAGE_KEY = 'PHOTION_ENCRYPTION_STORAGE_KEY';
export const PHOTION_SESSION_CREDENTIALS = 'PHOTION_SESSION_CREDENTIALS';

export const strategy = new WebCryptoAesGcpHandler();

export const handler = new LocalStorageHandler(PHOTION_ENCRYPTION_STORAGE_KEY, {
  strategy,
  localStorage: window.localStorage,
});

export const encryptionKey = computed(() => `${user.name}#${user.password}`);

export const encrypt = (plaintext: string): Promise<string> => strategy.encrypt({ password: encryptionKey.value }, plaintext);

export const decrypt = (encrypted: string): Promise<string> => strategy.decrypt({ password: encryptionKey.value }, encrypted);

export const secrets = reactive<Secrets>({
  aws: {
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
  },
  gcp: {
    apiKey: '',
    apiSecret: '',
  },
});

export const deserialize = (payload: unknown) => {
  if (typeof payload === 'object') {
    const data: Partial<Secrets> = payload ?? {};

    secrets.aws.region = data.aws?.region || '';
    secrets.aws.accessKeyId = data.aws?.accessKeyId || '';
    secrets.aws.secretAccessKey = data.aws?.secretAccessKey || '';
    secrets.gcp.apiKey = data?.gcp?.apiKey || '';
    secrets.gcp.apiSecret = data?.gcp?.apiSecret || '';
  }
};

export const save = async () => {
  window.sessionStorage.setItem(PHOTION_SESSION_CREDENTIALS, JSON.stringify(secrets));

  await handler.save({ password: encryptionKey.value }, secrets);
};

export const load = async () => {
  const secrets = await handler.load({ password: encryptionKey.value });

  window.sessionStorage.setItem(PHOTION_SESSION_CREDENTIALS, JSON.stringify(secrets));

  deserialize(secrets);
};

export const init = () => {
  const encoded = window.sessionStorage.getItem(PHOTION_SESSION_CREDENTIALS);

  if (encoded) {
    deserialize(JSON.parse(encoded));
  }

  user.name = window.sessionStorage.getItem('PHOTION_USERNAME') || '';
};
