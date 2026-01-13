"use client"
import React, {useEffect, useState, useRef} from "react";
import {motion} from "framer-motion";
import {scrollToSection} from "@/hooks/scrollToSection";
import type {NavigationItem} from "@/lib/config/navigation";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenuButton, MobileMenu } from "./MobileMenu";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

type NavbarProps = {
    options: NavigationItem[];
};

const Navbar: React.FC<NavbarProps> = ({ options }) => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const handleScroll = () => {
            if (rafRef.current !== undefined) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                const newScrolled = window.scrollY > 20;
                if (newScrolled !== scrolled) {
                    setScrolled(newScrolled);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current !== undefined) {
                cancelAnimationFrame(rafRef.current);
            }
        };
}, [scrolled]);

    const handleNavigate = (targetId: string) => {
        const didScroll = scrollToSection(targetId);
        if (didScroll) {
            setOpen(false);
        }
    };

    return (
        <motion.header
            className="w-full sticky top-0 z-50 backdrop-blur border-b border-[var(--theme-border)] transition-all"
            animate={{
                backgroundColor: scrolled ? 'var(--theme-surface)' : 'var(--theme-bg-primary)',
                boxShadow: scrolled ? 'var(--theme-shadow-md)' : 'none'
            }}
        >
            <nav className="mx-auto flex max-w-6xl items-center justify-end px-6 py-4 gap-4">
                <DesktopMenu options={options} onNavigate={handleNavigate} />
                <MobileMenuButton isOpen={open} onClick={() => setOpen((prev) => !prev)} />
            </nav>

            <MobileMenu isOpen={open} options={options} onNavigate={handleNavigate} />
        </motion.header>
    );
};

export default Navbar;
