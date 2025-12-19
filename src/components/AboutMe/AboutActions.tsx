"use client"

import React from "react";
import { Button } from "@/components/Button";
import { scrollToSection } from "@/hooks/scrollToSection";

type AboutActionsProps = {
    cta1Label: string;
    cta1Url: string;
    cta2Label: string;
    cta2Url: string;
};

export const AboutActions = ({ cta1Label, cta1Url, cta2Label, cta2Url }: AboutActionsProps) => (
    <div className="flex flex-wrap gap-3 pt-2 md:pt-4 justify-center lg:justify-start">
        <Button asChild>
            {cta2Url.startsWith('http') ? (
                <a href={cta2Url} target="_blank" rel="noopener noreferrer">{cta2Label}</a>
            ) : (
                <a onClick={() => scrollToSection("contact")}>{cta2Label}</a>
            )}
        </Button>
        <Button variant="secondary" asChild>
            <a href={cta1Url}>{cta1Label}</a>
        </Button>
    </div>
);
