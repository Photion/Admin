import { v4 as uuid4 } from 'uuid';


/**
 * Creates an element identifier.
 * Helpful for HTML IDs or named inputs.
 *
 * @param type
 * @param name
 */
export const createIdentifier = (type: string, name?: string) => {
  let internalName = name;

  if (!internalName) {
    internalName = uuid4();
  }

  return `${type}:${internalName}`;
};

/**
 * Shared component props.
 */
export const componentProps = {
  name: {
    type: String,
    default: () => '',
  },
  uuid: {
    type: String,
    default: () => uuid4(),
  },
};
