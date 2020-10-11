import * as ExifReader from 'exifreader';

import { getBuffer, getText } from '~/src/files/utils';

export interface ExifTag {
  description: string;
  value: string;
}

export interface ExifTags {
  DateTimeOriginal?: ExifTag;
  MetadataDate?: ExifTag;
  Thumbnail?: {
    base64: string;
  };
}


export const readImage = async (file: File) => {
  const buffer = await getBuffer(file);
  const tags = ExifReader.load(buffer) as unknown as ExifTags;

  let preview: string;

  if (tags.Thumbnail?.base64) {
    preview = `data:image/jpg;base64,${tags.Thumbnail.base64}`;
  } else {
    preview = await getText(file);
  }

  const date = tags?.MetadataDate?.description || tags?.DateTimeOriginal?.description || null;

  return {
    date,
    preview,
    tags,
  };
};
