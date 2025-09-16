import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { site } from "@/configs/site";

export function LogoSidebar() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-accent"
        >
          <SidebarTrigger className="cursor-pointer" />
          {/* <div className="bg-background text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              src="/1.svg"
              alt="logo"
              width={60}
              height={60}
              className="rounded-lg p-0.5"
            />
          </div> */}
          {/* <div className="grid flex-1 text-left text-sm leading-tight"> */}
          <span className="font-semibold text-lg">{site.name}</span>
          {/* </div> */}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
