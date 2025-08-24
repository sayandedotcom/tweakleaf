import { Metadata } from "next";

import { User2, Bot, CreditCard, Fingerprint } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";
import { SettingsHeader } from "@/components/settings/settings-header";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your settings",
};

const settingsTabs = [
  {
    title: "General",
    info: "General settings",
    icon: <User2 />,
  },
  {
    title: "Account",
    info: "Account settings",
    icon: <Fingerprint />,
  },
  {
    title: "Models",
    info: "Model settings",
    icon: <Bot />,
  },
  {
    title: "Billing",
    info: "Billing settings",
    icon: <CreditCard />,
  },
];

export default function SettingsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hidden w-full space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <SettingsHeader settingsTabs={settingsTabs} />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="mx-2 lg:w-3/12">
          <SidebarNav section="settings" items={settingsTabs} />
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
