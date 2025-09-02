import { Bot, Fingerprint, User2 } from "lucide-react";

export const settingsTabs = [
  {
    title: "General",
    info: "General settings",
    href: "/settings/general",
    icon: <User2 />,
  },
  {
    title: "Account",
    info: "Account settings",
    href: "/settings/account",
    icon: <Fingerprint />,
  },
  {
    title: "Models",
    info: "Model settings",
    href: "/settings/models",
    icon: <Bot />,
  },
  // {
  //   title: "Billing",
  //   info: "Billing settings",
  //   icon: <CreditCard />,
  // },
];
