import React from "react";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { InfoCard } from "@/components/InfoCard";
import { Button } from "@/components/Button";

const AboutMe = () => {
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

            <div className="grid gap-10 md:gap-16 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
                <div className="space-y-5">
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
                </div>

                {/* Columna cards */}
                <div className="grid gap-4 md:gap-5">
                    <InfoCard title="Experience">
                        <p className="text-sm md:text-base font-semibold text-slate-900">
                            5+ years across residential, hospitality and mixed-use projects.
                        </p>
                    </InfoCard>

                    <InfoCard title="Focus">
                        <p className="text-sm md:text-base font-semibold text-slate-900">
                            Design development, Revit documentation, coordination with
                            consultants and builders.
                        </p>
                    </InfoCard>

                    <InfoCard title="Tools">
                        <p className="text-sm md:text-base font-semibold text-slate-900">
                            Revit, AutoCAD, Enscape, Adobe Suite, hand sketching and
                            physical model making.
                        </p>
                    </InfoCard>
                </div>
            </div>
        </Section>
    );
};

export default AboutMe;
