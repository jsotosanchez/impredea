/**
 *
 * @param {string} string
 */
export const formatToContains = (string) => {
  return `%${string}%`;
};

/**
 *
 * @param {string} string
 */
export const formatToStartsWith = (string) => {
  return `${string}%`;
};
