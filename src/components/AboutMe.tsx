"use client"
import React from "react";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import {scrollToSection} from "@/hooks/scrollToSection";

const AboutMe = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Section
            id="about me"
            tone="light"
            maxWidth="6xl"
        >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Foto lado izquierdo */}
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
                        {/* Marco decorativo */}
                        <div className="absolute inset-0 rounded-2xl border-8 border-white/10 pointer-events-none" />
                    </div>

                    {/* Elemento decorativo */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-30 -z-10" />
                    <div className="absolute -top-6 -left-6 w-40 h-40 bg-slate-200 rounded-full blur-3xl opacity-20 -z-10" />
                </motion.div>

                {/* Contenido lado derecho */}
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
                            I'm Maria Lourdes Ynigo, an architect with over 5 years of experience
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

                    {/* Stats rápidas */}
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-4 rounded-xl bg-white/80 border border-slate-200 shadow-sm">
                            <div className="text-2xl md:text-3xl font-bold text-slate-900">5+</div>
                            <div className="text-[10px] md:text-xs text-slate-600 mt-1 uppercase tracking-wider">Years</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/80 border border-slate-200 shadow-sm">
                            <div className="text-2xl md:text-3xl font-bold text-slate-900">20+</div>
                            <div className="text-[10px] md:text-xs text-slate-600 mt-1 uppercase tracking-wider">Projects</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/80 border border-slate-200 shadow-sm">
                            <div className="text-2xl md:text-3xl font-bold text-slate-900">2</div>
                            <div className="text-[10px] md:text-xs text-slate-600 mt-1 uppercase tracking-wider">Countries</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2 md:pt-4 justify-center lg:justify-start">
                        <Button asChild>
                            <a onClick={() => scrollToSection("contact")}>Let's Connect</a>
                        </Button>
                        <Button variant="secondary" asChild>
                            <a href="/CV_Lourdes_Ynigo.pdf">Download CV</a>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
};

export default AboutMe;
