"use client"
import React from "react";
import { Section } from "@/components/Section";
import { AboutImagePanel } from "./AboutImagePanel";
import { AboutBio } from "./AboutBio";
import { AboutStats } from "./AboutStats";
import { AboutActions } from "./AboutActions";

const AboutMe = () => {
    return (
        <Section
            id="about"
            tone="light"
            maxWidth="6xl"
        >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <AboutImagePanel />

                <div className="flex flex-col space-y-6 order-1 lg:order-2">
                    <AboutBio />
                    <AboutStats />
                    <AboutActions />
                </div>
            </div>
        </Section>
    );
};

export default AboutMe;
