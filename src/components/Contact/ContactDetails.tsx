import React from "react";
import Link from "next/link";
import { InfoCard } from "@/components/InfoCard";
import { Button } from "@/components/Button";

export const ContactDetails = () => (
    <InfoCard title="Details" variant="light">
        <div className="text-sm md:text-base text-slate-700 space-y-1">
            <p className="font-medium">Based in Queensland, Australia.</p>
            <p className="font-medium">Available for remote and local collaboration.</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
            <Button asChild>
                <Link href="https://calendly.com/mlourdesynigo/30min">
                    Schedule a Call
                </Link>
            </Button>
        </div>
    </InfoCard>
);
