import { DEEDY_COVER_LETTER } from "../constants/cover-letter-templates/deedy-cover-letter";

export const coverLetterTemplates = [
  {
    id: 1,
    name: "Deedy Cover Letter",
    value: "deedy-cover-letter",
    compiler: "xelatex",
    latex: DEEDY_COVER_LETTER,
    isDefault: true,
    isDisabled: false,
  },
];
