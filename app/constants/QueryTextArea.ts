const TextAreaConfig = {
  MIN_TEXTAREA_HEIGHT: 38,
  MAX_TEXTAREA_HEIGHT: 248,
  CHARACTER_LIMIT: 1000,
  //anything not inBasic Latin, Latin-1 Supplement, Latin Extended-A, plus some quotation marks
  // eslint-disable-next-line no-control-regex
  disallowedCharacters: new RegExp("[^\u0000-\u017F‘’“”]", "u"),
};

export { TextAreaConfig };
