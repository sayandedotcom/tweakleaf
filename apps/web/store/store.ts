import { create } from "zustand";

type Store = {
  resumeTemplate: string;
  coverLetterTemplate: string;
  setResumeTemplate: (resumeTemplate: string) => void;
  setCoverLetterTemplate: (coverLetterTemplate: string) => void;
};

export const useStore = create<Store>((set) => ({
  resumeTemplate: "jake's-resume",
  coverLetterTemplate: "deedy-cover-letter",
  setResumeTemplate: (resumeTemplate: string) => set({ resumeTemplate }),
  setCoverLetterTemplate: (coverLetterTemplate: string) =>
    set({ coverLetterTemplate }),
}));
