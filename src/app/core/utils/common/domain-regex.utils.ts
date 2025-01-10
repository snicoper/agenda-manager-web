/** Global regex patterns. */
export const DomainRegexUtils = {
  email: /^(?![.-])([\w.-]+)(?<![.-])@(?![.-])([\w-]+)(?<![.-])((\.([a-zA-Z]){2,3})+)$/,
  colorHexadecimal: /^#[0-9A-Fa-f]{6}$/i,
};
