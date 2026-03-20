import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-background/95 backdrop-blur-3xl text-foreground pt-20 pb-8 border-t border-border relative z-10 before:content-[''] before:absolute before:top-0 before:left-[15%] before:right-[15%] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-12">
                    
                    <div className="flex flex-col gap-5">
                        <Link href="/" className="inline-block mb-2 group">
                             <img 
                                src="/incpLogo.png" 
                                alt="Incorplus Logo" 
                                style={{ maxWidth: '160px', height: 'auto' }} 
                                className="transition-transform duration-400 ease-out group-hover:scale-105"
                             />
                        </Link>
                        
                        <p className="text-muted-foreground text-base leading-relaxed pr-2">
                            Simplifying legalities for startups in India. We are your partners in compliance, taxation, and growth. Focus on your business, let us handle the rest.
                        </p>
                        
                        <div className="flex gap-4 mt-4">
                            {/* Facebook */}
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-muted-foreground transition-all duration-[400ms] ease-in-out hover:-translate-y-1 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_8px_20px_-5px_rgba(37,99,235,0.5)]" title="Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-muted-foreground transition-all duration-[400ms] ease-in-out hover:-translate-y-1 hover:text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-fuchsia-600 hover:shadow-[0_8px_20px_-5px_rgba(236,72,153,0.5)]" title="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-muted-foreground transition-all duration-[400ms] ease-in-out hover:-translate-y-1 hover:text-white hover:bg-gradient-to-br hover:from-sky-600 hover:to-sky-700 hover:shadow-[0_8px_20px_-5px_rgba(2,132,199,0.5)]" title="LinkedIn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            {/* Twitter */}
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-muted-foreground transition-all duration-[400ms] ease-in-out hover:-translate-y-1 hover:text-white hover:bg-gradient-to-br hover:from-sky-400 hover:to-sky-600 hover:shadow-[0_8px_20px_-5px_rgba(56,189,248,0.5)]" title="Twitter">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <h3 className="font-bold text-xl text-foreground tracking-wide">Company</h3>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="#" className="relative inline-block text-base font-medium text-muted-foreground transition-all duration-300 group hover:text-foreground hover:translate-x-1 before:content-['→'] before:absolute before:-left-5 before:opacity-0 before:text-primary before:transition-all before:duration-300 hover:before:left-[-20px] hover:before:opacity-100">About Us</Link></li>
                            <li><Link href="#" className="relative inline-block text-base font-medium text-muted-foreground transition-all duration-300 group hover:text-foreground hover:translate-x-1 before:content-['→'] before:absolute before:-left-5 before:opacity-0 before:text-primary before:transition-all before:duration-300 hover:before:left-[-20px] hover:before:opacity-100">Services</Link></li>
                            <li><Link href="#" className="relative inline-block text-base font-medium text-muted-foreground transition-all duration-300 group hover:text-foreground hover:translate-x-1 before:content-['→'] before:absolute before:-left-5 before:opacity-0 before:text-primary before:transition-all before:duration-300 hover:before:left-[-20px] hover:before:opacity-100">FAQ</Link></li>
                            <li><Link href="#" className="relative inline-block text-base font-medium text-muted-foreground transition-all duration-300 group hover:text-foreground hover:translate-x-1 before:content-['→'] before:absolute before:-left-5 before:opacity-0 before:text-primary before:transition-all before:duration-300 hover:before:left-[-20px] hover:before:opacity-100">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-5">
                        <h3 className="font-bold text-xl text-foreground tracking-wide">Contact</h3>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-4 cursor-default group transition-transform duration-300 hover:translate-x-1">
                                <div className="flex items-center justify-center w-9 h-9 min-w-[36px] rounded-lg bg-secondary mt-0.5 transition-all duration-400 group-hover:bg-[#ef4444]/15 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                    <MapPin size={18} className="text-red-500" />
                                </div>
                                <span className="text-muted-foreground text-base font-medium leading-relaxed transition-colors group-hover:text-foreground">
                                    D-242, Noida sector 63,<br/>Electronic City 201301
                                </span>
                            </li>
                            <li className="flex items-center gap-4 cursor-pointer group transition-transform duration-300 hover:translate-x-1">
                                <div className="flex items-center justify-center w-9 h-9 min-w-[36px] rounded-lg bg-secondary transition-all duration-400 group-hover:bg-[#ef4444]/15 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                    <Phone size={18} className="text-red-500" />
                                </div>
                                <span className="text-muted-foreground text-base font-medium transition-colors group-hover:text-foreground">+91 91291 34553</span>
                            </li>
                            <li className="flex items-center gap-4 cursor-pointer group transition-transform duration-300 hover:translate-x-1">
                                <div className="flex items-center justify-center w-9 h-9 min-w-[36px] rounded-lg bg-secondary transition-all duration-400 group-hover:bg-[#ef4444]/15 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                    <Mail size={18} className="text-red-500" />
                                </div>
                                <span className="text-muted-foreground text-base font-medium transition-colors group-hover:text-foreground">info@incorplusventure.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 mt-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
                    <p className="text-muted-foreground text-sm font-medium text-center md:text-left">
                        © 2026 Incorplus Venture. All rights reserved.
                    </p>
                    
                    <div className="flex gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms of Services</Link>
                    </div>

                    <a 
                        href="https://www.pigo-pi.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1.5 relative transition-all duration-300 hover:z-20"
                    >
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70 transition-opacity duration-300 group-hover:opacity-100 text-foreground">
                            POWERED BY
                        </span>
            
                        <span className="font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-rose-500 to-purple-600 text-[13px] opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                            PigoPi
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
};