import {
  SOHAM_PAREKH_COLD_EMAIL,
  SOHAM_PAREKH_COLD_EMAIL_SUBJECT,
} from "@/constants/cold-mails-templates/soham-parekh";
import {
  SEEKING_REFERRAL,
  SEEKING_REFERRAL_SUBJECT,
} from "@/constants/cold-mails-templates/seeking-referral";
import {
  EXPERIENCED,
  EXPERIENCED_SUBJECT,
} from "@/constants/cold-mails-templates/experienced";
import {
  FOLLOW_UP,
  FOLLOW_UP_SUBJECT,
} from "@/constants/cold-mails-templates/follow-up";
import {
  REFERRAL_MENTION,
  REFERRAL_MENTION_SUBJECT,
} from "@/constants/cold-mails-templates/referral-mention";
import {
  FRESHER,
  FRESHER_SUBJECT,
} from "@/constants/cold-mails-templates/fresher";
import {
  FORMAL,
  FORMAL_SUBJECT,
} from "@/constants/cold-mails-templates/formal";
import {
  TWEAKLEAF_FOUNDER,
  TWEAKLEAF_FOUNDER_SUBJECT,
} from "@/constants/cold-mails-templates/tweakleaf-founder";

export const coldEmailTemplates = [
  {
    id: 1,
    name: "Soham Parekh's Cold Email",
    value: "soham-parekh's-cold-email",
    body: SOHAM_PAREKH_COLD_EMAIL,
    subject: SOHAM_PAREKH_COLD_EMAIL_SUBJECT,
    isDefault: true,
    isDisabled: false,
  },
  {
    id: 2,
    name: "Tweakleaf Founder's Cold Email",
    value: "tweakleaf-founder's-cold-email",
    body: TWEAKLEAF_FOUNDER,
    subject: TWEAKLEAF_FOUNDER_SUBJECT,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 3,
    name: "Seeking Referral",
    value: "seeking-referral",
    body: SEEKING_REFERRAL,
    subject: SEEKING_REFERRAL_SUBJECT,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 4,
    name: "Experienced",
    value: "experienced",
    body: EXPERIENCED,
    subject: EXPERIENCED_SUBJECT,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 5,
    name: "Follow Up",
    value: "follow-up",
    body: FOLLOW_UP,
    subject: FOLLOW_UP_SUBJECT,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 6,
    name: "Referral Mention",
    value: "referral-mention",
    body: REFERRAL_MENTION,
    subject: REFERRAL_MENTION_SUBJECT,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 7,
    name: "Fresher",
    value: "fresher",
    body: FRESHER,
    subject: FRESHER_SUBJECT,
    isDefault: false,
    isDisabled: false,
  },
  {
    id: 8,
    name: "Formal",
    value: "formal",
    body: FORMAL,
    subject: FORMAL_SUBJECT,
    isDefault: false,
    isDisabled: false,
  },
];
