"use client";

import * as React from "react";
import {motion, useReducedMotion} from "framer-motion";

type SectionProps = {
    id?: string;
    labelledBy?: string;
    tone?: "dark" | "light";
    maxWidth?: "4xl" | "6xl";
    className?: string;
    children: React.ReactNode;
};

export function Section({
                            id,
                            labelledBy,
                            tone = "light",
                            maxWidth = "6xl",
                            className = "",
                            children,
                        }: SectionProps) {
    const bg = tone === "dark" ? "bg-slate-900" : "bg-[#f5f5f5]";
    const gradientFrom = tone === "dark" ? "from-slate-100/5" : "from-slate-900/5";
    const gradientTo = tone === "dark" ? "to-slate-800/10" : "to-slate-900/10";
    const reduceMotion = useReducedMotion();

    return (
        <motion.section
            id={id}
            role="region"
            aria-labelledby={labelledBy}
            className={`relative w-full py-16 md:py-24 ${bg} ${className}`}
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
        >
            <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${gradientFrom} via-transparent ${gradientTo}`}
                aria-hidden="true"
            />
            <div className={`relative z-10 mx-auto px-6 md:px-12 max-w-${maxWidth}`}>
                {children}
            </div>
        </motion.section>
    );
}
