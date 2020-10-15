import { ConceptProps } from '~/src/models/Concept';
import { FragmentProps } from '~/src/models/Fragment';
import { ProjectProps } from '~/src/models/Project';

export {
  ConceptProps,
  FragmentProps,
  ProjectProps,
};

export interface Schema {
  concepts: { [key: string]: ConceptProps | undefined };
  fragments: { [key: string]: FragmentProps | undefined };
  projects: { [key: string]: ProjectProps | undefined };
}

export type Model = ConceptProps | FragmentProps | ProjectProps;

export type Group = { [key: string]: Model | undefined };

export type Namespace = keyof Schema;
