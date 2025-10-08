import { SID_LACY_COVER_LETTER } from "@/constants/cover-letter-templates/sid-lacy-cover-letter";
import { DEEDY_COVER_LETTER } from "../constants/cover-letter-templates/deedy-cover-letter";
import { ENTRY_LEVEL_COVER_LETTER } from "../constants/cover-letter-templates/entry-level-cover-letter";

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
  {
    id: 2,
    name: "Sid Lacy Cover Letter",
    value: "sid-lacy-cover-letter",
    compiler: "xelatex",
    latex: SID_LACY_COVER_LETTER,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 3,
    name: "Entry Level Cover Letter",
    value: "entry-level-cover-letter",
    compiler: "xelatex",
    latex: ENTRY_LEVEL_COVER_LETTER,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 4,
    name: "More Templates",
    value: "none",
    compiler: "xelatex",
    latex: ENTRY_LEVEL_COVER_LETTER,
    isDefault: false,
    isDisabled: true,
  },
];
