"use client";

import { site } from "@/configs/site";
import { navigation } from "@/configs/navbar";
import PillNav from "./PillNav";
import { usePathname } from "next/navigation";
import GlassSurface from "./GlassSurface";

export function PillNavComponent() {
  const pathname = usePathname();

  // Transform navigation items to PillNav format
  const navItems = navigation.map((nav) => ({
    label: nav.title,
    href: nav.path,
  }));

  return (
    <div className="fixed top-0 z-50 w-full bg-transparent">
      <div className="flex items-center justify-center pt-12">
        {/* <div
          className="backdrop-blur-md border border-border/40 rounded-full px-2 py-2 shadow-lg"
          style={{
            background:
              "linear-gradient(hsla(0, 0%, 100%, 0.3), hsla(0, 0%, 100%, 0.3))",
          }}
        > */}
        <GlassSurface width={900} height={50} borderRadius={24}>
          <PillNav
            logo={site.logo}
            logoAlt={site.name}
            siteName={site.name}
            items={navItems}
            initialLoadAnimation={false}
            activeHref={pathname}
            className="!static !w-auto !top-0 !left-0"
            ease="power2.easeOut"
            baseColor="hsl(var(--card))"
            pillColor="hsl(var(--primary))"
            hoveredPillTextColor="hsl(var(--primary-foreground))"
            pillTextColor="hsl(var(--foreground))"
          />
        </GlassSurface>
      </div>
    </div>
  );
}
