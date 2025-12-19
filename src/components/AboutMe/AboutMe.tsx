"use client"
import React from "react";
import { Section } from "@/components/Section";
import { AboutImagePanel } from "./AboutImagePanel";
import { AboutBio } from "./AboutBio";
import { AboutStats } from "./AboutStats";
import { AboutActions } from "./AboutActions";
import type { AboutSectionDTO } from "@/lib/cms/schemas";

type AboutMeProps = {
    content: AboutSectionDTO;
};

const AboutMe = ({ content }: AboutMeProps) => {
    return (
        <Section
            id="about"
            tone="light"
            maxWidth="6xl"
        >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <AboutImagePanel 
                    imageUrl={content.imageUrl}
                    imageAlt={content.imageAlt}
                />

                <div className="flex flex-col space-y-6 order-1 lg:order-2">
                    <AboutBio 
                        eyebrow={content.eyebrow}
                        title={content.title}
                        paragraph1={content.paragraph1}
                        paragraph2={content.paragraph2}
                        paragraph3={content.paragraph3}
                    />
                    <AboutStats 
                        stat1Value={content.stat1Value}
                        stat1Label={content.stat1Label}
                        stat2Value={content.stat2Value}
                        stat2Label={content.stat2Label}
                        stat3Value={content.stat3Value}
                        stat3Label={content.stat3Label}
                    />
                    <AboutActions 
                        cta1Label={content.cta1Label}
                        cta1Url={content.cta1Url}
                        cta2Label={content.cta2Label}
                        cta2Url={content.cta2Url}
                    />
                </div>
            </div>
        </Section>
    );
};

export default AboutMe;
