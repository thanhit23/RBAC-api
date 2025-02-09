export const toKebabCase = (str: string): string => {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
