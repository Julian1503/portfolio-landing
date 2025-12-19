"use client";

import React from "react";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactEmailCard } from "./ContactEmailCard";
import { ContactDetails } from "./ContactDetails";
import { ContactForm } from "./ContactForm";

const ContactSection = () => {
    return (
        <Section
            id="contact"
            tone="light"
            maxWidth="6xl"
        >
            <SectionHeader
                id="contact-heading"
                eyebrow="Contact"
                title="Let's work together"
                tone="light"
                description="For collaborations, job opportunities or project enquiries, feel free to reach out by email or schedule a short call."
            />

            <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
                <div className="space-y-6">
                    <ContactEmailCard />
                    <ContactDetails />
                </div>

                <ContactForm />
            </div>
        </Section>
    );
};

export default ContactSection;