"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

type ScrollCueProps = {
    onClick?: () => void;
};

const ScrollCue = ({ onClick }: ScrollCueProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 cursor-pointer"
        onClick={onClick}
    >
        <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <ArrowDown className="w-5 h-5 text-[var(--theme-primary-text)] opacity-70" />
        </motion.div>
    </motion.div>
);

export default ScrollCue;
