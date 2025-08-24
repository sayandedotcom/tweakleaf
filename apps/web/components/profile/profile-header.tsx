"use client";

interface ProfileHeaderProps {
  profileTabs: Array<{
    title: string;
    info: string;
    icon: React.ReactNode;
  }>;
}

export function ProfileHeader({ profileTabs }: ProfileHeaderProps) {
  return (
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
      <p className="text-muted-foreground">
        Manage your profile information and preferences. <br /> The more
        information you provide, the more personalized optimized results you
        will get. One time pain, long term gain !
      </p>
    </div>
  );
}
