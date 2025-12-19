import React from "react";
import { InfoCard } from "@/components/InfoCard";

type ContactEmailCardProps = {
    email: string;
};

export const ContactEmailCard = ({ email }: ContactEmailCardProps) => (
    <InfoCard title="Email" variant="light">
        <a
            href={`mailto:${email}`}
            className="text-base md:text-lg font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-800 transition-colors"
        >
            {email}
        </a>

        <p className="mt-3 text-xs md:text-sm text-slate-600">
            Preferred way to get in touch. I usually reply within 1–2 business days.
        </p>
    </InfoCard>
);
