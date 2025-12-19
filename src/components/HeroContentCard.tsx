"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/Button";

type HeroContentCardProps = {
    onProjectsClick: () => void;
    onContactClick: () => void;
};

const HeroContentCard = ({ onProjectsClick, onContactClick }: HeroContentCardProps) => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-3 p-4 sm:p-6 md:p-8 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/15 shadow-2xl"
        >
            <span className="text-[10px] sm:text-xs md:text-sm tracking-[0.35em] text-gray-200 uppercase">
                Portfolio
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase">
                Maria Lourdes
                <br />
                Ynigo
            </h1>

            <div className="flex flex-wrap items-center mt-2 gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase px-3 sm:px-4 py-1 rounded-full border border-white/30 text-white/90 bg-black/20">
                    Architect
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase px-3 sm:px-4 py-1 rounded-full border border-white/30 text-white/90 bg-black/20">
                    Architecture Technician
                </span>
            </div>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-100/90 max-w-xl">
                Residential and commercial design with a focus on context, light and everyday life.
            </p>

            <motion.div
                className="flex flex-wrap gap-3 mt-4"
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
            >
                <Button onClick={onProjectsClick} className=" text-slate-900 hover:bg-gray-100 shadow-lg">
                    View Projects
                </Button>
                <Button
                    onClick={onContactClick}
                    className="bg-white/20 hover:bg-white/30 focus:ring-2 focus:ring-white"
                >
                    Get in Touch
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default HeroContentCard;
