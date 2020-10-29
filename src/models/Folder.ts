
import dayjs from 'dayjs';
import { v4 as uuid4 } from 'uuid';
import * as yup from 'yup';

import { FileCategory } from '~/src/files/metadata';
import { Model, ModelName, Namespace } from '~/src/models/Model';

export interface Folder {
  uuid?: string;
  name?: string;
  description?: string;
  type: FileCategory;
  projects: string[];
  tags: string[];
  date: string;
  public: boolean;
  featured: boolean;
  created: number;
}

export const FolderModel: Model<Required<Folder>> = {
  name: ModelName.Folder,
  namespace: Namespace.Folder,
  schema: yup
    .object({
      uuid: yup.string().uuid().default(() => uuid4()).defined(),
      name: yup.string().default(() => '').defined(),
      description: yup.string().default(() => '').defined(),
      type: yup.string().oneOf(Object.values(FileCategory)).default(() => FileCategory.IMAGE).required(),
      projects: yup.array().of(yup.string().required()).default(() => []).defined(),
      tags: yup.array().of(yup.string().required()).default(() => []).defined(),
      date: yup.string().default(dayjs().format('YYYY-MM-DD')).defined(),
      public: yup.boolean().default(() => false).required(),
      featured: yup.boolean().default(() => false).required(),
      created: yup.number().integer().default(() => 0).defined(),
    })
    .required(),
};
