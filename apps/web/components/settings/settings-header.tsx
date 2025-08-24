"use client";

interface SettingsHeaderProps {
  settingsTabs: Array<{
    title: string;
    info: string;
    icon: React.ReactNode;
  }>;
}

export function SettingsHeader({ settingsTabs }: SettingsHeaderProps) {
  return (
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground">
        Manage your settings and preferences.
      </p>
    </div>
  );
}
