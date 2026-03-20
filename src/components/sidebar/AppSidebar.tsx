"use client"
import {
  Home,
  LayoutDashboard,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const sidebarMenu = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Project Report", href: "/create-project-report", icon: FileText },
  { label: "CMA Report", href: "/create-cma-report", icon: FileText },
   // {
  //   label: "Billing",
  //   href: "/billing",
  //   icon: CreditCard,
  // },
  { label: "Billing", href: "#", icon: CreditCard },
  { label: "Plans", href: "/pricing", icon: FileText },
  { label: "Support", href: "/support", icon: HelpCircle },
];

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div 
      className={cn(
        "h-screen bg-card p-4 border-r border-border flex flex-col shadow-[4px_0_24px_-15px_rgba(0,0,0,0.1)] z-10 transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    > 
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-background border border-border rounded-full p-1.5 shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer z-50"
      >
        {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>
      
      <div className="flex-1 mt-4 overflow-hidden">
        <div className={cn("mb-10 transition-all duration-300", isCollapsed ? "opacity-0 h-0" : "opacity-100 h-8")}>
          <h2 className="text-2xl font-extrabold text-center text-foreground whitespace-nowrap">
            {/* Dashboard */}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {sidebarMenu.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/');

            return (
              <Link key={item.label} href={item.href} title={isCollapsed ? item.label : undefined}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"} 
                  className={cn(
                    "w-full border-transparent transition-all duration-200 ease-in-out cursor-pointer rounded-xl font-semibold h-11",
                    isCollapsed ? "justify-center px-0" : "justify-start px-4",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm border border-primary/20" 
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground" 
                  )} 
                >
                  <item.icon 
                    className={cn(
                      "h-5 w-5 transition-transform duration-200 shrink-0", 
                      isCollapsed ? "" : "mr-3",
                      isActive ? "text-primary scale-110" : "group-hover:scale-110"
                    )} 
                  /> 
                  
                  <span 
                    className={cn(
                      "text-[15px] whitespace-nowrap transition-all duration-300",
                      isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
                    )}
                  >
                    {item.label}
                  </span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Logout section */}
      <div className="mt-auto pt-6 border-t border-border/60 overflow-hidden">
        <Button 
          variant="ghost" 
          title={isCollapsed ? "Log out" : undefined}
          className={cn(
            "w-full cursor-pointer rounded-xl font-semibold h-11 group transition-all duration-200 ease-in-out active:scale-95 border border-transparent",
            // LIGHT MODE STYLES
            "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-sm hover:border-red-200",
            // DARK MODE STYLES
            "dark:bg-red-950/30 dark:text-red-500 dark:hover:bg-red-900/50 dark:hover:text-red-400 dark:hover:border-red-800/40",
            isCollapsed ? "justify-center px-0" : "justify-start px-4"
          )}
          onClick={() => { logout() }}
        >
          <LogOut 
            className={cn(
              "h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1 shrink-0",
              isCollapsed ? "" : "mr-3"
            )} 
          />
          <span 
            className={cn(
              "text-[15px] whitespace-nowrap transition-all duration-300",
              isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
            )}
          >
            Log out
          </span>
        </Button>
      </div>
    </div>
  );
}

