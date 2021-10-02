export const removeEmptyFields = (object) => Object.fromEntries(Object.entries(object).filter(([_, v]) => v != null));
