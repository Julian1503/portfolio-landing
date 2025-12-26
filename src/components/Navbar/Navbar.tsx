"use client"
import React, {useEffect, useState} from "react";
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 0 0 0 rgba(0, 0, 0, 0)'
            }}
        >
            <nav className="mx-auto flex max-w-6xl items-center justify-end px-6 py-4 gap-4">
                <DesktopMenu options={options} onNavigate={handleNavigate} />
                <ThemeSwitcher />
                <MobileMenuButton isOpen={open} onClick={() => setOpen((prev) => !prev)} />
            </nav>

            <MobileMenu isOpen={open} options={options} onNavigate={handleNavigate} />
        </motion.header>
    );
};

export default Navbar;
