"use client"

import React from "react";
import { Button } from "@/components/Button";
import { scrollToSection } from "@/hooks/scrollToSection";

export const AboutActions = () => (
    <div className="flex flex-wrap gap-3 pt-2 md:pt-4 justify-center lg:justify-start">
        <Button asChild>
            <a onClick={() => scrollToSection("contact")}>Let&apos;s Connect</a>
        </Button>
        <Button variant="secondary" asChild>
            <a href="/CV_Lourdes_Ynigo.pdf">Download CV</a>
        </Button>
    </div>
);
