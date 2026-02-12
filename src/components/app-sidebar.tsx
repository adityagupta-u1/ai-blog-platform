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

const roleNavData:Record<Role,SidebarData> = {
  Admin: {
    navMain: [
      {
        title: "Leads Management",
        url: "/dashboard/SuperAdmin/lead-management",
        icon: Users, // e.g. from lucide-react
      },
      {
        title: "Assign Leads",
        url: "/dashboard/SuperAdmin/assign-leads",
        icon: Wallet, // or Banknote, CreditCard, etc.
      },
      // {
      //   title: "Attendance Management",
      //   url: "/dashboard/SuperAdmin/attendance_management",
      //   icon: Clock,
      // },
      {
        title: "Configuration & Settings",
        url: "#",
        icon: Settings,
        items: [
          { title: "Departments", url: "/dashboard/SuperAdmin/configuration/departments" },
          { title: "Leave Types", url: "/dashboard/SuperAdmin/configuration/leave-types" },
          { title: "Holidays", url: "/dashboard/SuperAdmin/configuration/holidays" },
          // { title: "Manage Admin Accounts", url: "/dashboard/SuperAdmin/configuration/manage_admin_accounts" },
          // { title: "Full System Configuration Access", url: "/dashboard/SuperAdmin/configuration/system_configuration" },
        ],
      },
    ],
    navSecondary: [
      { title: "Support", url: "#", icon: LifeBuoy },
    ],
  },
  User: {
    navMain: [
      { title: "Employee Management", url: "/dashboard/Admin/employee-management", icon: Users },
      { title: "Salary Register", url: "/dashboard/Admin/salary-register", icon: Wallet },
      { title: "Attendance Management", url: "/dashboard/Admin/attendance_management", icon: Clock },
    ],
    navSecondary: [
      { title: "Support", url: "#", icon: LifeBuoy, },
    ],
  },
}


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
