import { Calendar, Home, Inbox, Search } from "lucide-react";
import { AppSidebar } from '../_components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '../_components/ui/sidebar';

const items = [
    {
      title: "Overview",
      url: "#",
      icon: Home,
    },
    {
      title: "Posts",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Analytics",
      url: "#",
      icon: Calendar,
    },
    {
      title: "SEO",
      url: "#",
      icon: Search,
    }
  ]

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen'>
        <SidebarProvider>
            <AppSidebar menuItems={items}/>
            <main className="flex-1 p-4">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    </div>
  );
}

