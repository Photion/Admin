import { Namespace } from '~/src/models/Model';
import { Folder } from '~/src/models/Folder';
import { Medium } from '~/src/models/Medium';
import { Project } from '~/src/models/Project';

export interface ModelCollection<T> {
  [key: string]: T | undefined;
}

export type ModelSchema = {
  [Namespace.Folder]: Required<Folder>;
  [Namespace.Medium]: Required<Medium>;
  [Namespace.Project]: Required<Project>;
}

export type Props = ModelSchema[Namespace];

export type CollectionSchema = {
  [T in keyof ModelSchema]: ModelCollection<ModelSchema[T]>;
}

export type Collections = CollectionSchema[keyof CollectionSchema]

export interface Schema {
  models: ModelSchema;
  collections: CollectionSchema;
}
