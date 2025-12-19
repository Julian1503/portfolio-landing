import React from "react";
import { InfoCard } from "@/components/InfoCard";

export const ContactEmailCard = () => (
    <InfoCard title="Email" variant="light">
        <a
            href="mailto:mlourdesynigo@gmail.com"
            className="text-base md:text-lg font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-800 transition-colors"
        >
            mlourdesynigo@gmail.com
        </a>

        <p className="mt-3 text-xs md:text-sm text-slate-600">
            Preferred way to get in touch. I usually reply within 1–2 business days.
        </p>
    </InfoCard>
);
