"use client"

import React from "react";
import { motion } from "framer-motion";

interface StatItemProps {
    value: string;
    label: string;
}

const StatItem = ({ value, label }: StatItemProps) => (
    <div className="text-center p-4 rounded-xl bg-white/80 border border-slate-200 shadow-sm">
        <div className="text-2xl md:text-3xl font-bold text-slate-900">{value}</div>
        <div className="text-[10px] md:text-xs text-slate-600 mt-1 uppercase tracking-wider">{label}</div>
    </div>
);

export const AboutStats = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 gap-4 pt-4"
    >
        <StatItem value="5+" label="Years" />
        <StatItem value="20+" label="Projects" />
        <StatItem value="2" label="Countries" />
    </motion.div>
);

export { StatItem };
