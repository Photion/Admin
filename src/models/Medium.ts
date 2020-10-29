import { v4 as uuid4 } from 'uuid';
import * as yup from 'yup';

import { WithFileAttachedProps } from '~/src/files/metadata';
import {
  FileMetadataSchema,
  FileContentSchema,
  Model,
  ModelName,
  Namespace,
} from '~/src/models/Model';

export interface Medium extends WithFileAttachedProps {
  uuid?: string;
  folder: string;
  notes?: string;
  created: number;
}

export const MediumModel: Model<Required<Medium>> = {
  name: ModelName.Medium,
  namespace: Namespace.Medium,
  schema: yup
    .object({
      uuid: yup.string().uuid().default(() => uuid4()).required(),
      folder: yup.string().required(),
      notes: yup.string().default(() => '').defined(),
      meta: FileMetadataSchema.required(),
      file: FileContentSchema.required(),
      created: yup.number().integer().default(() => 0).defined(),
    })
    .required(),
};
