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
    const bg = tone === "dark"
        ? "bg-[var(--theme-bg-secondary)]"
        : "bg-[var(--theme-bg-primary)]";
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
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
                aria-hidden="true"
            />
            <div className={`relative z-10 mx-auto px-6 md:px-12 max-w-${maxWidth}`}>
                {children}
            </div>
        </motion.section>
    );
}
