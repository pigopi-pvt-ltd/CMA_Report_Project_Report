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
        <header className="relative" style={{ zIndex: 99999 }}>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 w-full transition-all duration-300 pointer-events-auto',
                    scrolled 
                        ? 'bg-background/95 backdrop-blur-3xl border-b shadow-sm' 
                        : 'bg-transparent border-transparent'
                )}
                style={{ zIndex: 99999 }} 
            >
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-center justify-between py-4 pr-16 lg:pr-14">
                        
                        {/* 1. LEFT EXTREME: Logo */}
                        <div className="flex items-center justify-start flex-1">
                            <Link href="/" className="flex items-center gap-2 cursor-pointer">
                                {/* <Logo /> */}
                                <span className="font-bold text-lg tracking-tight">CMA</span>
                            </Link>
                        </div>

                        {/* 2. EXACT CENTER: Menu Links */}
                        <div className="hidden lg:flex items-center justify-center gap-8 text-sm font-medium">
                            {menuItems.map((item, index) => (
                                <Link 
                                    key={index} 
                                    href={item.href} 
                                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* 3. RIGHT EXTREME: Auth Buttons */}
                        <div className="flex items-center justify-end flex-1 gap-3">
                            <div className="hidden lg:flex items-center gap-3">
                                {mounted && (
                                    isLoggedIn ? (
                                        <Link 
                                            href="/dashboard"
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors cursor-pointer"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link 
                                                href="/sign-in"
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                                            >
                                                Sign in
                                            </Link>
                                            <Link 
                                                href="/sign-up"
                                                className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-9 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors cursor-pointer"
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
                                className="lg:hidden p-2 text-foreground cursor-pointer"
                            >
                                {menuState ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>

                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {menuState && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-3xl border-b shadow-lg px-6 py-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
                        <div className="flex flex-col gap-4 text-base font-medium">
                            {menuItems.map((item, index) => (
                                <Link 
                                    key={index} 
                                    href={item.href} 
                                    onClick={() => setMenuState(false)} 
                                    className="text-muted-foreground hover:text-foreground cursor-pointer"
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
                                        className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors cursor-pointer"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link 
                                            href="/sign-in"
                                            className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                                        >
                                            Sign in
                                        </Link>
                                        <Link 
                                            href="/sign-up"
                                            className="inline-flex w-full items-center justify-center rounded-md text-sm font-semibold h-10 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors cursor-pointer"
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
        </header>
    )
}