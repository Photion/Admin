
import { ExifTags, readImage } from '~/src/files/images';

export enum FileCategory {
  IMAGE = 'IMAGE',
  SOUND = 'SOUND',
  VIDEO = 'VIDEO',
}


export enum FileStorage {
  PREVIEW = 'PREVIEW',
  FULL_QUALITY = 'FULL_QUALITY',
  RAW = 'RAW',
}

/**
 * File metadata
 */
export interface FileMetadata {
  filename: string;
  mime: string;
  size: number;
  storage: FileStorage;
  public: boolean;
  date: string | null;
  tags: FileTags;
}

export interface FileContent {
  id: string;
  url?: string;
  data?: string;
  file?: File;
}

export type FileTags = ExifTags | null;

export interface FileInfo {
  date: string | null;
  preview: string;
  tags: FileTags;
}

export interface WithFileAttachedProps {
  meta: FileMetadata;
  file: FileContent;
}

export const IMAGE_OPTIONS = {
  reader: readImage,
  type: FileCategory.IMAGE,
};

export const SOUND_OPTIONS = {
  reader: () => readImage,
  type: FileCategory.SOUND,
};

export const VIDEO_OPTIONS = {
  reader: () => readImage,
  type: FileCategory.VIDEO,
};

export enum MimeTypes {
  'image/bmp' = 'image/bmp',
  'image/png' = 'image/png',
  'image/jpeg' = 'image/jpeg',
  'image/gif' = 'image/gif',
  'image/svg+xml' = 'image/svg+xml',
  'image/webp' = 'image/webp',
}

export const MIME_OPTIONS = {
  [MimeTypes['image/bmp']]: IMAGE_OPTIONS,
  [MimeTypes['image/png']]: IMAGE_OPTIONS,
  [MimeTypes['image/jpeg']]: IMAGE_OPTIONS,
  [MimeTypes['image/gif']]: IMAGE_OPTIONS,
  [MimeTypes['image/svg+xml']]: IMAGE_OPTIONS,
  [MimeTypes['image/webp']]: IMAGE_OPTIONS,
};

export const isSupportedMime = (mime: string): mime is keyof typeof MIME_OPTIONS => {
  return mime in MIME_OPTIONS;
};

export const hasPreview = (el: WithFileAttachedProps): boolean => {
  return isSupportedMime(el.meta.mime) && el.meta.storage === FileStorage.PREVIEW;
};

export const readUnsupportedFile = async (file: File): Promise<FileInfo> => {
  const lastModified = new Date(file.lastModified);

  return {
    date: lastModified.toISOString(),
    preview: '',
    tags: null,
  };
};

export const readFile = (file: File): Promise<FileInfo> => {
  const mime = file.type;

  if (isSupportedMime(mime)) {
    const options = MIME_OPTIONS[mime];

    return options.reader(file);
  }

  return Promise.resolve(readUnsupportedFile(file));
};


export const getFriendlyFilename = (filename: string) => {
  return filename.split('.').slice(0, -1).join('.');
};
