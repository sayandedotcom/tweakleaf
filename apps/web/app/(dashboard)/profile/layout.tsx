import { Metadata } from "next";

import {
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  User2,
  HeartHandshake,
  FileBadge2,
  FolderOpenDot,
  Brain,
  Heart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SidebarNav } from "@/components/sidebar-nav";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile information and preferences",
};

const profileTabs = [
  {
    title: "Basic Info",
    info: "Basic info and links",
    icon: <User2 />,
    href: "/profile/basic-info",
  },
  {
    title: "Education",
    info: "List of schools and degrees",
    icon: <GraduationCap />,
    href: "/profile/education",
  },
  {
    title: "Experience",
    info: "List of companies and positions",
    icon: <Briefcase />,
    href: "/profile/experience",
  },
  {
    title: "Projects",
    info: "List of projects and roles",
    icon: <FolderOpenDot />,
    href: "/profile/projects",
  },
  {
    title: "Skills",
    info: "List of skills and proficiency",
    icon: <Brain />,
    href: "/profile/skills",
  },
  {
    title: "Achievements",
    info: "List of achievements and awards",
    icon: <Trophy />,
    href: "/profile/achievements",
  },
  {
    title: "Interests",
    info: "List of interests and hobbies",
    icon: <Heart />,
    href: "/profile/interests",
  },
  {
    title: "Awards",
    info: "List of awards and recognition",
    icon: <Award />,
    href: "/profile/awards",
  },
  {
    title: "Volunteering",
    info: "List of volunteering and community service",
    icon: <HeartHandshake />,
    href: "/profile/volunteering",
  },
  {
    title: "Certifications",
    info: "List of certifications and courses",
    icon: <FileBadge2 />,
    href: "/profile/certifications",
  },
];

export default function ProfilePage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hidden w-full space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <ProfileHeader profileTabs={profileTabs} />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="mx-2 lg:w-3/12">
          <SidebarNav section="profile" items={profileTabs} />
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
