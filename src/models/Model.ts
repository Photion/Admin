import * as yup from 'yup';

import { FileStorage, FileMetadata, FileContent, readFile, WithFileAttachedProps } from '~/src/files/metadata';


export enum ModelName {
  Folder = 'Folder',
  Medium = 'Medium',
  Project = 'Project',
}

export enum Namespace {
  Folder = 'folders',
  Medium = 'media',
  Project = 'projects',
}


export interface Model<Shape extends object> {
  name: ModelName;
  namespace: Namespace;
  schema: yup.ObjectSchema<Shape>;
}

export const FileMetadataSchema = yup
  .object<FileMetadata>({
    filename: yup.string().default(() => '').defined(),
    mime: yup.string().default(() => '').defined(),
    size: yup.number().integer().default(() => 0).defined(),
    storage: yup.string().oneOf(Object.values(FileStorage)).default(() => FileStorage.PREVIEW).required(),
    public: yup.boolean().default(() => false).required(),
    date: yup.string().default(() => '').defined(),
    tags: yup.mixed().default(() => null).defined(),
  });

export const FileContentSchema = yup
  .object<FileContent>({
    id: yup.string().default(() => '').defined(),
    url: yup.string().default(() => '').defined(),
    data: yup.string().default(() => '').defined(),
    file: yup.mixed<File>().default(() => null).defined(),
  });

export const isWithFileAttached = (instance: unknown): instance is WithFileAttachedProps => {
  if (typeof instance !== 'object') {
    return false;
  }

  if (!instance) {
    return false;
  }

  if (!('meta' in instance)) {
    return false;
  }
  if (!('file' in instance)) {
    return false;
  }

  return true;
};

export const setFile = async (container: WithFileAttachedProps, file: File) => {
  const { preview, date, tags } = await readFile(file);

  container.file = await FileContentSchema
    .required()
    .validate({
      file,
      data: preview,
      url: preview,
    });

  container.meta = await FileMetadataSchema
    .required()
    .validate({
      tags,
      date,
      filename: file.name,
      size: file.size,
      mime: file.type,
    });

  return container;
};
