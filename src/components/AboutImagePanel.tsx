"use client"

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const AboutImagePanel = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative order-2 lg:order-1"
    >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
            <Image
                src="/img/lourdes-professional.jpeg"
                alt="Maria Lourdes Ynigo - Architect"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 rounded-2xl border-8 border-white/10 pointer-events-none" />
        </div>

        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute -top-6 -left-6 w-40 h-40 bg-slate-200 rounded-full blur-3xl opacity-20 -z-10" />
    </motion.div>
);
