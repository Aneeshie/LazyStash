"use client";

import {
  Bot,
  CreditCard,
  LayoutDashboardIcon,
  Plus,
  Presentation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import UseProject from "~/hooks/use-project";
import { cn } from "~/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  const { projects, selectedProjectId, setselectedProjectId } = UseProject();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          {open && <h1>LazyStash</h1>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Application Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        pathname === item.url && "bg-primary text-white",
                        "list-none",
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects */}
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton asChild>
                    <button
                      type="button"
                      onClick={() => setselectedProjectId(project.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-sm px-2 py-1 text-sm",
                        project.id === selectedProjectId &&
                          "bg-primary text-white",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-sm border text-sm",
                          project.id === selectedProjectId &&
                            "bg-primary text-white",
                        )}
                      >
                        {project.projectName[0]!.toUpperCase()}
                      </div>

                      <span
                        className={cn(
                          "truncate",
                          project.id === selectedProjectId && "text-white",
                        )}
                      >
                        {project.projectName}
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <div className="h-2" />

              <SidebarMenuItem>
                <Link href="/create">
                  <Button size="sm" variant="outline">
                    <Plus className="size-3 cursor-pointer" />
                    {open && "Create Project"}
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
