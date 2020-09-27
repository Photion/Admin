

export interface Service {
  name: string;
  logo: string;
  slug: string;
}

export const aws: Service = {
  name: 'Amazon Web Services',
  logo: '/logos/aws.svg',
  slug: 'aws',
};

export const gcp: Service = {
  name: 'Google Cloud Platform',
  logo: '/logos/gcp.png',
  slug: 'gcp',
};

export const googleDrive: Service = {
  name: 'Google Drive',
  logo: '/logos/googleDrive.svg',
  slug: 'googleDrive',
};

export const browser: Service = {
  name: 'Your Browser (dev)',
  logo: '',
  slug: 'browser',
};

export const services = {
  aws,
  gcp,
  googleDrive,
  browser,
};
