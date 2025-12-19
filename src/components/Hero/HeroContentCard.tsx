"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/Button";
import type { HeroSectionDTO } from "@/lib/cms/schemas";

type HeroContentCardProps = {
    content: HeroSectionDTO;
    onProjectsClick: () => void;
    onContactClick: () => void;
};

const HeroContentCard = ({ content, onProjectsClick, onContactClick }: HeroContentCardProps) => {
    const reduceMotion = useReducedMotion();
    const nameLines = React.useMemo(() => content.name.split(' '), [content.name]);

    return (
        <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-3 p-4 sm:p-6 md:p-8 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/15 shadow-2xl"
        >
            <span className="text-[10px] sm:text-xs md:text-sm tracking-[0.35em] text-gray-200 uppercase">
                {content.eyebrow}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase">
                {nameLines.map((word, idx) => (
                    <React.Fragment key={idx}>
                        {word}
                        {idx < nameLines.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </h1>

            <div className="flex flex-wrap items-center mt-2 gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase px-3 sm:px-4 py-1 rounded-full border border-white/30 text-white/90 bg-black/20">
                    {content.badge1}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase px-3 sm:px-4 py-1 rounded-full border border-white/30 text-white/90 bg-black/20">
                    {content.badge2}
                </span>
            </div>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-100/90 max-w-xl">
                {content.tagline}
            </p>

            <motion.div
                className="flex flex-wrap gap-3 mt-4"
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
            >
                <Button onClick={onProjectsClick} className=" text-slate-900 hover:bg-gray-100 shadow-lg">
                    {content.projectsLabel}
                </Button>
                <Button
                    onClick={onContactClick}
                    className="bg-white/20 hover:bg-white/30 focus:ring-2 focus:ring-white"
                >
                    {content.contactLabel}
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default HeroContentCard;
