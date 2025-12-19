"use client";

import React from "react";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactEmailCard } from "./ContactEmailCard";
import { ContactDetails } from "./ContactDetails";
import { ContactForm } from "./ContactForm";
import type { ContactSectionDTO } from "@/lib/cms/schemas";

type ContactSectionProps = {
    content: ContactSectionDTO;
};

const ContactSection = ({ content }: ContactSectionProps) => {
    return (
        <Section
            id="contact"
            tone="light"
            maxWidth="6xl"
        >
            <SectionHeader
                id="contact-heading"
                eyebrow={content.eyebrow}
                title={content.title}
                tone="light"
                description={content.description}
            />

            <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
                <div className="space-y-6">
                    <ContactEmailCard email={content.email} />
                    <ContactDetails 
                        location={content.location}
                        availability={content.availability}
                        calendlyUrl={content.calendlyUrl}
                    />
                </div>

                <ContactForm />
            </div>
        </Section>
    );
};

export default ContactSection;