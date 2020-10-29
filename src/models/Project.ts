import { v4 as uuid4 } from 'uuid';
import * as yup from 'yup';

import { Model, ModelName, Namespace } from '~/src/models/Model';

export interface Project {
  uuid?: string;
  name?: string;
  description?: string;
  portfolio?: boolean;
  created: number;
}

export const ProjectModel: Model<Required<Project>> = {
  name: ModelName.Project,
  namespace: Namespace.Project,
  schema: yup
    .object({
      uuid: yup.string().uuid().default(() => uuid4()).required(),
      name: yup.string().default(() => '').required(),
      description: yup.string().default(() => '').required(),
      portfolio: yup.boolean().default(() => false).required(),
      created: yup.number().integer().default(() => 0).defined(),
    })
    .required(),
};
