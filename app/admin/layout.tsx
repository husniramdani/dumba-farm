import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
