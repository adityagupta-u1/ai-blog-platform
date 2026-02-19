"use client"

import {
  Clock,
  Command,
  LifeBuoy,
  Settings,
  Users,
  Wallet,
  type LucideProps,
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Role } from "@/global"



interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: Role
  email:string
  name:string
}

type SidebarData = {
  // user: {
  //   name: string
  //   email: string
  //   avatar: string
  // }
  navMain: (
    | {
        title: string
        url: string
        icon: React.ForwardRefExoticComponent<
          Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >
      }
    | {
        title: string
        url: string
        icon: React.ForwardRefExoticComponent<
          Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >
        items: { title: string; url: string }[]
      }
  )[]
  navSecondary: {
    title: string
    url: string
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >
  }[]
}

const roleNavData: Record<Role, SidebarData> = {
  Admin: {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Command,
      },
      {
        title: "All Posts",
        url: "/dashboard/posts",
        icon: Users,
      },
      {
        title: "Create Post",
        url: "/dashboard/createPost",
        icon: Wallet,
      },
      {
        title: "AI Tools",
        url: "#",
        icon: Settings,
        items: [
          { title: "Generate Blog", url: "/dashboard/ai/generate" },
          { title: "SEO Optimizer", url: "/dashboard/ai/seo" },
          { title: "Title Generator", url: "/dashboard/ai/title" },
          { title: "Content Ideas", url: "/dashboard/ai/ideas" },
        ],
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Clock,
      },
    ],
    navSecondary: [
      {
        title: "Billing",
        url: "/dashboard/billing",
        icon: Wallet,
      },
      {
        title: "Support",
        url: "/dashboard/support",
        icon: LifeBuoy,
      },
    ],
  },

  User: {
    navMain: [
      {
        title: "My Posts",
        url: "/dashboard/posts",
        icon: Users,
      },
      {
        title: "Create Post",
        url: "/dashboard/createPost",
        icon: Wallet,
      },
      {
        title: "AI Assistant",
        url: "/dashboard/ai",
        icon: Settings,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "/dashboard/support",
        icon: LifeBuoy,
      },
    ],
  },
};



export function AppSidebar({ email,name,...props }:AppSidebarProps ) {
  const currentRole = "Admin" as Role; // This should come from props or context
  const {navMain,navSecondary} = roleNavData[currentRole]
  return (
    <Sidebar
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ATS</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{name:name,email:email }} />
      </SidebarFooter>
    </Sidebar>
  )
}
