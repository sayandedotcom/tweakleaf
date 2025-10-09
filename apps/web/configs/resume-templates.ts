import { DEEDY_CV } from "../constants/resume-templates/deedy-cv";
import { JAKE_RESUME } from "../constants/resume-templates/jakes-resume";
import { BASE_ROVER } from "../constants/resume-templates/base-rover";
import { SOURABH_BAJAJ_RESUME } from "@/constants/resume-templates/sourabh-bajaj-resume";

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
    name: "Sourabh Bajaj",
    value: "sourabh-bajaj-resume",
    compiler: "xelatex",
    latex: SOURABH_BAJAJ_RESUME,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 4,
    name: "Base Rover",
    value: "base-rover",
    compiler: "xelatex",
    latex: BASE_ROVER,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 5,
    name: "More Templates",
    value: "none",
    compiler: "xelatex",
    latex: BASE_ROVER,
    isDefault: false,
    isDisabled: true,
  },
];
