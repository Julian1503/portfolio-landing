"use client";

import React from "react";
import { scrollToSection } from "@/hooks/scrollToSection";
import HeroBackground from "./HeroBackground";
import HeroContentCard from "./HeroContentCard";
import ScrollCue from "./ScrollCue";
import type { HeroSectionDTO } from "@/lib/cms/schemas";

type HeroProps = {
    content: HeroSectionDTO;
};

const Hero = ({ content }: HeroProps) => {
    const handleProjectsClick = () => scrollToSection("projects");
    const handleContactClick = () => scrollToSection("contact");
    const handleScrollCueClick = () => scrollToSection("about");

    return (
        <section id="home" className="relative w-full h-[100svh] min-h-[540px] overflow-hidden bg-white">
            <HeroBackground 
                backgroundImage={content.backgroundImage}
                backgroundVideo={content.backgroundVideo}
            />

            <div className="relative z-10 h-full">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-center md:justify-start px-4 sm:px-6 md:px-10 lg:px-16">
                    <div className="w-full max-w-sm sm:max-w-md md:max-w-xl">
                        <HeroContentCard
                            content={content}
                            onProjectsClick={handleProjectsClick}
                            onContactClick={handleContactClick}
                        />
                    </div>
                </div>
            </div>

            <ScrollCue onClick={handleScrollCueClick} />
        </section>
    );
};

export default Hero;
