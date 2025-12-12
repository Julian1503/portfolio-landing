"use client"
import React from "react";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { InfoCard } from "@/components/InfoCard";
import { Button } from "@/components/Button";
import { motion } from "framer-motion";

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
            id="about"
            tone="dark"
            maxWidth="6xl"
            labelledBy="about-heading"
        >
            <SectionHeader
                id="about-heading"
                eyebrow="About Me"
                title="Maria Lourdes Ynigo"
                tone="dark"
            />

            <motion.div className="grid gap-10 md:gap-16 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
                <motion.div
                    className="space-y-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                        Architect trained in Argentina and based in Australia, with a
                        strong focus on residential and mixed-use projects. I enjoy
                        working from early concept sketches to detailed documentation,
                        always looking for clear spatial ideas, natural light and
                        connection with everyday life.
                    </p>

                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                        My experience ranges from housing developments and hospitality to
                        small-scale interventions. I am comfortable collaborating with
                        engineers and consultants, coordinating Revit models and keeping
                        drawings precise and buildable.
                    </p>

                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                        I am particularly interested in context-driven design, sustainable
                        strategies and solutions that feel calm, warm and timeless rather
                        than trendy.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button asChild>
                            <a href="/CV_Lourdes_Ynigo.pdf">Download CV</a>
                        </Button>
                        <Button variant="secondary" asChild>
                            <a href="#projects">View Projects</a>
                        </Button>
                    </div>
                </motion.div>

                {/* Columna cards */}
                <motion.div
                    className="grid gap-4 md:gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div variants={cardVariants}>
                    <InfoCard title="Experience">
                        <p className="text-sm md:text-base font-semibold text-slate-900">
                            5+ years across residential, hospitality and mixed-use projects.
                        </p>
                    </InfoCard>
                    </motion.div>
                    <motion.div variants={cardVariants}>
                    <InfoCard title="Focus">
                        <p className="text-sm md:text-base font-semibold text-slate-900">
                            Design development, Revit documentation, coordination with
                            consultants and builders.
                        </p>
                    </InfoCard>
                    </motion.div>
                    <motion.div variants={cardVariants}>
                    <InfoCard title="Tools">
                        <p className="text-sm md:text-base font-semibold text-slate-900">
                            Revit, AutoCAD, Enscape, Adobe Suite, hand sketching and
                            physical model making.
                        </p>
                    </InfoCard>
                    </motion.div>
                </motion.div>
            </motion.div>
        </Section>
    );
};

export default AboutMe;
