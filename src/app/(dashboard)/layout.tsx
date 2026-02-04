import { AppSidebar } from "@/components/sidebar/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AppSidebar />
      {children}
    </div>
  );
}
