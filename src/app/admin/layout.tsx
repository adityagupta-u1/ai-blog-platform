
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Role } from "@/global";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen'>
        <SidebarProvider>
            <AppSidebar email="aditya.gupin1950@gmail.com" name="aditya gupta" role={Role.ADMIN} />
            <main className="flex-1 p-4">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    </div>
  );
}

