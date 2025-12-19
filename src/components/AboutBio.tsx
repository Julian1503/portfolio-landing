"use client"

import React from "react";
import { motion } from "framer-motion";

export const AboutBio = () => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="order-1 lg:order-2 space-y-6 flex flex-col justify-center lg:justify-start"
    >
        <div className="space-y-2">
            <span className="text-xs md:text-sm tracking-[0.35em] uppercase text-amber-700 font-semibold">
                Meet the Architect
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Design with purpose,
                <br />
                built with care
            </h2>
        </div>

        <div className="space-y-4 text-sm md:text-base text-slate-600 leading-relaxed">
            <p>
                I&apos;m Maria Lourdes Ynigo, an architect with over 5 years of experience
                creating thoughtful spaces that balance functionality, aesthetics, and
                human connection.
            </p>
            <p>
                Trained in Argentina and now based in Queensland, Australia, I bring
                a unique perspective to every project—combining Latin American warmth
                with Australian pragmatism.
            </p>
            <p>
                My approach is simple: listen deeply, design intentionally, and deliver
                spaces that feel timeless rather than trendy.
            </p>
        </div>
    </motion.div>
);
