"use client"

import React from "react";
import { motion } from "framer-motion";

interface StatItemProps {
    value: string;
    label: string;
}

const StatItem = ({ value, label }: StatItemProps) => (
    <div className="text-center p-4 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-sm">
        <div className="text-2xl md:text-3xl font-bold text-[var(--theme-text)]">{value}</div>
        <div className="text-[10px] md:text-xs text-[var(--theme-text-muted)] mt-1 uppercase tracking-wider">{label}</div>
    </div>
);

type AboutStatsProps = {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
};

export const AboutStats = ({ 
    stat1Value, 
    stat1Label, 
    stat2Value, 
    stat2Label, 
    stat3Value, 
    stat3Label 
}: AboutStatsProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 gap-4 pt-4"
    >
        <StatItem value={stat1Value} label={stat1Label} />
        <StatItem value={stat2Value} label={stat2Label} />
        <StatItem value={stat3Value} label={stat3Label} />
    </motion.div>
);

export { StatItem };
