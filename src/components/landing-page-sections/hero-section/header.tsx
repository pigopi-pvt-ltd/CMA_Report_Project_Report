'use client'
import Link from 'next/link'
// import { Logo } from '@/components/landing-page-sections/hero-section/logo'
import { Menu, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useScroll } from 'motion/react'

const menuItems = [
    { name: 'Product', href: '#' },
    { name: 'Developers', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Docs', href: '#' },
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
                        ? 'z-50 bg-background/95 backdrop-blur-3xl border-b border-border shadow-md' 
                        : 'z-20 bg-transparent border-transparent'
                )}
            >
                <div className="mx-auto max-w-7xl px-6 pointer-events-auto">
                    <div className="relative flex items-center justify-between py-4 pr-16 lg:pr-20 pointer-events-auto">
                        
                        {/* 1. LEFT EXTREME: Logo */}
                        <div className="flex-1 flex items-center justify-start pointer-events-auto">
                            <Link href="/" className="flex items-center gap-2 cursor-pointer pointer-events-auto">
                                {/* <Logo /> */}
                                <span className="font-bold text-lg tracking-tight">CMA</span>
                            </Link>
                        </div>

                        {/* 2. EXACT CENTER: Menu Links */}
                        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium pointer-events-auto">
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

                        {/* 3. RIGHT EXTREME */}
                        <div className="flex-1 flex items-center justify-end gap-3 pointer-events-auto">
                            <div className="hidden lg:flex items-center gap-3 pointer-events-auto">
                                {mounted && (
                                    isLoggedIn ? (
                                        <Link 
                                            href="/dashboard"
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-purple-600 hover:bg-purple-700 !text-white dark:text-white shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link 
                                                href="/sign-in"
                                                // className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer pointer-events-auto"
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-purple-600 hover:bg-purple-700 !text-white dark:text-white shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                            >
                                                Sign in
                                            </Link>
                                            <Link 
                                                href="/sign-up"
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-purple-600 hover:bg-purple-700 !text-white dark:text-white shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                            >
                                                Start your project
                                            </Link>
                                        </>
                                    )
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMenuState(!menuState)}
                                className="lg:hidden p-2 text-foreground cursor-pointer pointer-events-auto"
                            >
                                {menuState ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>

                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {menuState && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-background/80 backdrop-blur-md border-b border-border shadow-lg px-6 py-6 flex flex-col gap-6 animate-in slide-in-from-top-2 pointer-events-auto">
                        <div className="flex flex-col gap-4 text-base font-medium pointer-events-auto">
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
                        <div className="flex flex-col gap-3 pt-4 border-t border-border">
                            {mounted && (
                                isLoggedIn ? (
                                    <Link 
                                        href="/dashboard"
                                        className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white dark:text-white shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link 
                                            href="/sign-in"
                                            // className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer pointer-events-auto"
                                            className="inline-flex w-full items-center justify-center rounded-md text-sm font-semibold h-10 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors cursor-pointer pointer-events-auto"
                                        >
                                            Sign in
                                        </Link>
                                        <Link 
                                            href="/sign-up"
                                            className="inline-flex w-full items-center justify-center rounded-md text-sm font-semibold h-10 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors cursor-pointer pointer-events-auto"
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
            <div className="h-16" />
        </>
    )
}