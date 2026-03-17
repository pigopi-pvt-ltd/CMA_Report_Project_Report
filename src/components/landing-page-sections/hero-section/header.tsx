'use client'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useScroll } from 'motion/react'

const menuItems = [
    { name: 'Pricing', href: '/pricing' },
    { name: 'Docs', href: '/' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const token = localStorage.getItem('token'); 
        if (token) setIsLoggedIn(true);
    }, [])

    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 w-full transition-all duration-300 pointer-events-auto',
                    scrolled 
                        ? 'z-50 bg-background/80 backdrop-blur-3xl border-b border-border shadow-md' 
                        : 'z-10 bg-background/95 backdrop-blur-3xl border-b border-border shadow-sm'
                )}
            >
                <div className="mx-auto max-w-7xl px-6 pointer-events-auto">
                    <div className="relative flex items-center py-4 pointer-events-auto justify-between">
                        
                        {/* LEFT SECTION: Logo */}
                        <div className="flex items-center gap-12 pointer-events-auto">
                            
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2 cursor-pointer pointer-events-auto shrink-0 transition-transform hover:scale-105">
                                <img src="/incpLogo.png" alt="CMA Logo" className="h-10 w-auto pointer-events-auto" />
                            </Link>

                            <div className="hidden lg:flex items-center gap-8 text-base font-semibold pointer-events-auto mt-1">
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

                        {/* RIGHT SECTION: Action Buttons (Dashboard, Login, etc) */}
                        <div className="flex items-center gap-4 pointer-events-auto">
                            <div className="hidden lg:flex items-center gap-3 pointer-events-auto">
                                {mounted && (
                                    isLoggedIn ? (
                                        <Link 
                                            href="/dashboard"
                                            className="inline-flex items-center justify-center rounded-lg text-base font-semibold h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer pointer-events-auto hover:-translate-y-0.5"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link 
                                                href="/sign-in"
                                                className="inline-flex items-center justify-center rounded-lg text-base font-semibold h-10 px-5 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm transition-all cursor-pointer pointer-events-auto hover:-translate-y-0.5"
                                            >
                                                Sign in
                                            </Link>
                                            <Link 
                                                href="/sign-up"
                                                className="inline-flex items-center justify-center rounded-lg text-base font-semibold h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer pointer-events-auto hover:-translate-y-0.5"
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
                                {menuState ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>

                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {menuState && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top-2 pointer-events-auto">
                        <div className="flex flex-col gap-6 text-lg font-semibold pointer-events-auto">
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
                        <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
                            {mounted && (
                                isLoggedIn ? (
                                    <Link 
                                        href="/dashboard"
                                        className="inline-flex w-full items-center justify-center rounded-lg text-base font-semibold h-12 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link 
                                            href="/sign-in"
                                            className="inline-flex w-full items-center justify-center rounded-lg text-base font-semibold h-12 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                        >
                                            Sign in
                                        </Link>
                                        <Link 
                                            href="/sign-up"
                                            className="inline-flex w-full items-center justify-center rounded-lg text-base font-semibold h-12 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors cursor-pointer pointer-events-auto"
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
            {/* Navbar spacing helper */}
            <div className="h-20" />
        </>
    )
}