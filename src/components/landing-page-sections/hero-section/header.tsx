
'use client'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useScroll } from 'motion/react'
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const menuItems = [
    { name: 'Pricing', href: '/pricing' },
    { name: 'Docs', href: '/' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isAuthLoading, setIsAuthLoading] = useState(true)
    
    const router = useRouter()
    const pathname = usePathname() 

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsAuthLoading(true);
                const { data } = await authClient.getSession();
                setIsLoggedIn(!!data); 
            } catch (error) {
                console.error("Auth check error:", error);
                setIsLoggedIn(false);
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuthStatus();
    }, [pathname]);

    const { scrollYProgress } = useScroll()

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    const logout = async () => {
        try {
            const { error } = await authClient.signOut()
            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Logged out successfully")
                setIsLoggedIn(false);
                router.push("/sign-in")
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 w-full transition-all duration-300 pointer-events-auto',
                    scrolled 
                        ? 'z-50 bg-background/80 backdrop-blur-3xl border-b border-border shadow-md py-4' 
                        : 'z-10 bg-background/95 backdrop-blur-3xl border-b border-border shadow-sm py-6'
                )}
            >
                <div className="mx-auto max-w-7xl px-6 pointer-events-auto">
                    <div className="relative flex items-center justify-between pointer-events-auto">
                        
                        {/* LEFT SECTION: Logo AND Menu Links combined */}
                        <div className="flex items-center gap-20 pointer-events-auto">
                            <Link href="/" className="flex items-center gap-2 cursor-pointer pointer-events-auto shrink-0 transition-transform hover:scale-105">
                            <img src="/incpLogo.png" alt="CMA Logo" className="h-10 w-auto pointer-events-auto" />
                            </Link>

                            <div className="hidden lg:flex items-center gap-18 text-xl font-semibold pointer-events-auto mt-1">
                                {menuItems.map((item, index) => (
                                    <Link 
                                        key={index} 
                                        href={item.href} 
                                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer pointer-events-auto"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SECTION: Action Buttons */}
                        <div className="flex items-center gap-4 pointer-events-auto">
                            <div className="hidden lg:flex items-center gap-12 pointer-events-auto">
                                {!isAuthLoading && (
                                    isLoggedIn ? (
                                        <>
                                            <Link 
                                                href="/dashboard"
                                                className="inline-flex items-center justify-center rounded-xl text-lg font-semibold h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer pointer-events-auto hover:-translate-y-0.5"
                                            >
                                                Dashboard
                                            </Link>
                                            <button 
                                                onClick={logout}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl text-lg font-semibold h-11 px-5 bg-secondary hover:bg-red-50 text-secondary-foreground hover:text-red-600 shadow-sm border border-transparent hover:border-red-200 transition-all cursor-pointer pointer-events-auto hover:-translate-y-0.5"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                Log out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link 
                                                href="/sign-in"
                                                className="inline-flex items-center justify-center rounded-xl text-lg font-semibold h-11 px-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm transition-all cursor-pointer pointer-events-auto hover:-translate-y-0.5"
                                            >
                                                Sign in
                                            </Link>
                                            <Link 
                                                href="/sign-up"
                                                className="inline-flex items-center justify-center rounded-xl text-lg font-semibold h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer pointer-events-auto hover:-translate-y-0.5"
                                            >
                                                Sign up
                                            </Link>
                                        </>
                                    )
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMenuState(!menuState)}
                                className="lg:hidden p-2 text-foreground cursor-pointer pointer-events-auto ml-auto transition-transform hover:scale-110"
                            >
                                {menuState ? <X className="size-8" /> : <Menu className="size-8" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {menuState && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top-2 pointer-events-auto">
                        <div className="flex flex-col gap-6 text-xl font-semibold pointer-events-auto">
                            {menuItems.map((item, index) => (
                                <Link 
                                    key={index} 
                                    href={item.href} 
                                    onClick={() => setMenuState(false)} 
                                    className="text-muted-foreground hover:text-foreground cursor-pointer pointer-events-auto"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4 pt-6 border-t border-border/50">
                            {!isAuthLoading && (
                                isLoggedIn ? (
                                    <>
                                        <Link 
                                            href="/dashboard"
                                            className="inline-flex w-full items-center justify-center rounded-xl text-lg font-semibold h-14 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                        >
                                            Dashboard
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                setMenuState(false);
                                                logout();
                                            }}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl text-lg font-semibold h-14 px-4 py-2 bg-secondary hover:bg-red-50 text-secondary-foreground hover:text-red-600 shadow-sm border border-transparent hover:border-red-200 transition-colors cursor-pointer pointer-events-auto"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Log out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/sign-in"
                                            className="inline-flex w-full items-center justify-center rounded-xl text-lg font-semibold h-14 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                        >
                                            Sign in
                                        </Link>
                                        <Link 
                                            href="/sign-up"
                                            className="inline-flex w-full items-center justify-center rounded-xl text-lg font-semibold h-14 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                        >
                                            Start your project
                                        </Link>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}