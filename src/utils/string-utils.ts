export const capitalize = (str: string): string =>
  `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`;

export const uncapitalize = (str?: string) => {
  if (!str) return undefined;
  return `${str.substring(0, 1).toLowerCase()}${str.substring(1)}`;
}
  
