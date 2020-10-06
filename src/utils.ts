
/**
 * Represents the value
 * of a SelectOption
 */
export type SelectOptionValue = string | number | Record<string, unknown>

/**
 * Represents a SelectOption
 */
export interface SelectOption {
  value: SelectOptionValue;
  text: string;
}

/**
 * Transforms a "technical" string
 * into a label
 * @param str
 */
export const labelize = (str: string) => {
  return str
    .replace(/[\W-_]+/g, '-')
    .split('-')
    .filter((segment) => segment)
    .map((segment) => segment[0].toUpperCase() + segment.substring(1).toLowerCase())
    .join(' ');
};

/**
 * Transforms a single string value
 * into a SelectOption
 *
 * @param value
 */
export const toOption = (value: string): SelectOption => ({ value, text: labelize(value) });
