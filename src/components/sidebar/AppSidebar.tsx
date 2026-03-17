"use client"
import {
  Home,
  LayoutDashboard,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

export const sidebarMenu = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Project Report",
    href: "/create-project-report",
    icon: FileText,
  },
  {
    label: "CMA Report",
    href: "/create-cma-report",
    icon: FileText,
  },
  // {
  //   label: "Billing",
  //   href: "/billing",
  //   icon: CreditCard,
  // },
  {
    label: "Billing",
    href: "#",
    icon: CreditCard,
  },
  {
    label: "Plans",
    href: "/pricing",
    icon: FileText,
  },
  {
    label: "Support",
    href: "/support",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const logout = async () => {
    try {
      const { data, error } = await authClient.signOut()
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Logged out successfully")
        router.push("/sign-in")
      }
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <div className="w-64 h-screen bg-card p-5 border-r border-border flex flex-col shadow-[4px_0_24px_-15px_rgba(0,0,0,0.1)] z-10"> 
      
      <div className="flex-1">
        {/* Placeholder for Logo/Title area */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-center text-foreground">
            {/* Dashboard */}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {sidebarMenu.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/');

            return (
              <Link key={item.label} href={item.href}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"} 
                  className={`justify-start w-full border-transparent transition-all duration-200 ease-in-out cursor-pointer rounded-xl font-semibold h-11 px-4 ${
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm border border-primary/20" 
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground" 
                  }`} 
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${isActive ? "text-primary scale-110" : "group-hover:scale-110"}`} /> 
                  <span className="text-[15px]">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Logout section */}
      <div className="mt-auto pt-6 border-t border-border/60">
        <Button 
          variant="ghost" 
          className="justify-start w-full cursor-pointer rounded-xl font-semibold h-11 px-4 group transition-all duration-200 ease-in-out text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/30 active:scale-95"
          onClick={() => { logout() }}
        >
          <LogOut className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-[15px]">Log out</span>
        </Button>
      </div>
    </div>
  );
}

