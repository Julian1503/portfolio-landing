"use client"

import React from "react";
import { motion } from "framer-motion";

type AboutBioProps = {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
};

export const AboutBio = ({ eyebrow, title, paragraph1, paragraph2, paragraph3 }: AboutBioProps) => {
    const titleLines = React.useMemo(() => title.split(',').map(line => line.trim()), [title]);
    
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 flex flex-col justify-center lg:justify-start"
        >
            <div className="space-y-2">
                <span className="text-xs md:text-sm tracking-[0.35em] uppercase text-[var(--theme-primary)] font-semibold">
                    {eyebrow}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--theme-text)] leading-tight">
                    {titleLines.map((line, idx) => (
                        <React.Fragment key={idx}>
                            {line}
                            {idx < titleLines.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </h2>
            </div>

            <div className="space-y-4 text-sm md:text-base text-[var(--theme-text-secondary)] leading-relaxed">
                <p>{paragraph1}</p>
                <p>{paragraph2}</p>
                <p>{paragraph3}</p>
            </div>
        </motion.div>
    );
};
