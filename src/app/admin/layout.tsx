import { Calendar, ChartNoAxesCombined, Home, SearchCheck, Tags, User } from "lucide-react";
import { AppSidebar } from '../_components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '../_components/ui/sidebar';

const items = [
    {
      title: "Overview",
      url: "#",
      icon: Home,
    },
    {
      title: "Users",
      url: "#",
      icon: User,
    },
    {
      title: "Posts",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Tags & Categories",
      url: "#",
      icon: Tags,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartNoAxesCombined,
    },
    {
      title: "SEO",
      url: "#",
      icon: SearchCheck,
    },
  ]
  
export default function AdminLayout({
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

