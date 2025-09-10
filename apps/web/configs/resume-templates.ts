import { DEEDY_CV } from "../constants/resume-templates/deedy-cv";
import { JAKE_RESUME } from "../constants/resume-templates/jakes-resume";

export const resumeTemplates = [
  {
    id: 1,
    name: "Jake's Resume",
    value: "jake's-resume",
    compiler: "pdflatex",
    latex: JAKE_RESUME,
    isDefault: true,
    isDisabled: false,
  },
  {
    id: 2,
    name: "Deedy CV",
    value: "deedy-cv",
    compiler: "xelatex",
    latex: DEEDY_CV,
    isDefault: false,
    isDisabled: true,
  },
];
