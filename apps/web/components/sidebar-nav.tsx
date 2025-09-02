"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  section: string;
  items: Array<{
    title: string;
    info: string;
    icon: React.ReactNode;
    href: string;
  }>;
}

export function SidebarNav({ section, items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => {
        const href = item!.href;
        const isActive = pathname === href;

        return (
          <Link
            key={item.title}
            href={href}
            className={cn(
              "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            <span className="flex items-center space-x-2">
              {item.icon}
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
