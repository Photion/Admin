import { v4 as uuid4 } from 'uuid';


/**
 * Creates an element identifier.
 * Helpful for HTML IDs or named inputs.
 *
 * @param type
 * @param name
 * @param uuid
 */
export const generateId = (type: string, name?: string, uuid?: string) => {
  const elements = [type];

  if (name) {
    elements.push(name);
  }

  const family = elements.join(':');

  if (uuid) {
    elements.push(uuid);
  } else {
    elements.push(uuid4());
  }

  const unique = elements.join(':');

  return { family, unique };
};

export const useId = (type: string, props: { name: string; uuid: string }) => {
  return generateId(type, props.name, props.uuid);
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
