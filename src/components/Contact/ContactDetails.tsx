import React from "react";
import Link from "next/link";
import { InfoCard } from "@/components/InfoCard";
import { Button } from "@/components/Button";

type ContactDetailsProps = {
    location: string;
    availability: string;
    calendlyUrl?: string | null;
};

export const ContactDetails = ({ location, availability, calendlyUrl }: ContactDetailsProps) => (
    <InfoCard title="Details" variant="light">
        <div className="text-sm md:text-base text-[var(--theme-text)] space-y-1">
            <p className="font-medium">Based in {location}.</p>
            <p className="font-medium">{availability}.</p>
        </div>

        {calendlyUrl && (
            <div className="flex flex-wrap gap-3 pt-4">
                <Button asChild>
                    <Link href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                        Schedule a Call
                    </Link>
                </Button>
            </div>
        )}
    </InfoCard>
);
