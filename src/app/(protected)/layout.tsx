import { UserButton } from "@clerk/nextjs";
import React from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

type props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: props) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="m-2 w-full">
        <div className="border-sidebar-border bg-sidebar flex items-center gap-2 rounded-md p-2 px-4 shadow">
          {/* SearchBar  */}
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
        <div className="h-4">
          {/* main content*/}
          <div className="border-sidebar-border bg-sidebar rounded-mg overflow-y-scrol h-[calc(100vh-6rem)] border shadow">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
