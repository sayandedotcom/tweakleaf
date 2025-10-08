import { DEEDY_CV } from "../constants/resume-templates/deedy-cv";
import { BASE_ROVER } from "../constants/resume-templates/base-rover";
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
    isDisabled: false,
  },
  {
    id: 3,
    name: "Base Rover",
    value: "base-rover",
    compiler: "xelatex",
    latex: BASE_ROVER,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 4,
    name: "More Templates",
    value: "base-rover",
    compiler: "xelatex",
    latex: BASE_ROVER,
    isDefault: false,
    isDisabled: true,
  },
];
