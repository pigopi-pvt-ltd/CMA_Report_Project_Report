"use client"
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "../theme-togglers/animated-theme-toggler";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const sidebarMenu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    label: "Plans",
    href: "/plans",
    icon: FileText,
  },
  {
    label: "Support",
    href: "/support",
    icon: HelpCircle,
  },
  {
    label: "Logout",
    href: "/dashboard",
    icon: LogOut,
  }
];

export function AppSidebar() {
  const router = useRouter()

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
    <div className="w-50 h-screen bg-Sidebar p-4">  {/* Sidebar fixed width, full height */}
       <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-center text-foreground">
          {/* Dashboard */}
        </h2>

      </div>
      <div className="flex flex-col gap-2">
        {sidebarMenu.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button variant="ghost" className="justify-start w-full
               border-border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer rounded-lg" onClick={() => { if (item.label === "Logout") { logout() } }}>
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
        {/* Theme Toggle */}
        <span className="flex justify-center items-center">
          Theme: <AnimatedThemeToggler />
        </span>
      </div>
    </div>
  );
}

