"use client"
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {scrollToSection} from "@/hooks/scrollToSection";
type NavbarProps = {
    options: string[];
};

const Navbar: React.FC<NavbarProps> = ({ options }) => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className="w-full sticky top-0 z-50 backdrop-blur border-b transition-all"
            animate={{
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 0 0 0 rgba(0, 0, 0, 0)'
            }}
        >
            <nav className="mx-auto flex max-w-6xl items-center justify-end px-6 py-4">
                {/* Desktop menu */}
                <ul className="hidden md:flex flex-row gap-10">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => scrollToSection(option.toLowerCase())}
                            className="group flex flex-col items-center text-xs font-semibold tracking-wide cursor-pointer text-gray-800"
                        >
                            {option.toUpperCase()}
                            <span className="mt-1 h-[2px] w-0 bg-black transition-all duration-300 ease-in-out group-hover:w-full" />
                        </li>
                    ))}
                </ul>

                {/* Mobile menu button */}
                <button
                    className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm text-gray-800"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Toggle navigation"
                >
                    <div className="space-y-1">
                        <span className={`block h-0.5 w-5 bg-gray-800 transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
                        <span className={`block h-0.5 w-5 bg-gray-800 transition ${open ? "opacity-0" : ""}`} />
                        <span className={`block h-0.5 w-5 bg-gray-800 transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
                    </div>
                </button>
            </nav>

            {/* Mobile menu */}
            <div
                className={`md:hidden border-t bg-white/95 transition-all overflow-hidden ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <ul className="flex flex-col gap-4 px-6 py-6 text-sm font-semibold">
                    {options.map((option, index) => (
                        <li key={index} className="cursor-pointer text-gray-800">
                            {option.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.header>
    );
};

export default Navbar;
