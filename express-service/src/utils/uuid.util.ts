/**
 * Regular expression to strictly match a standard UUID format (v1-v5).
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Checks if a given string is a valid UUID pattern.
 */
export const isValidUUID = (id: string): boolean => UUID_REGEX.test(id);
