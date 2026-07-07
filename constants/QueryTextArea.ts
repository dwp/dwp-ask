import { CHARACTER_LIMIT } from "@/constants/Layout";

const TEXT_AREA_CONFIG = {
  MIN_TEXTAREA_HEIGHT: 38,
  MAX_TEXTAREA_HEIGHT: 248,
  CHARACTER_LIMIT,
  //anything not inBasic Latin, Latin-1 Supplement, Latin Extended-A, plus some quotation marks
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Required control
  disallowedCharacters: /[^\u0000-\u017F‘’“”]/u,
};

export { TEXT_AREA_CONFIG };
