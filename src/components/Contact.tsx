"use client";

import React from "react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { InfoCard } from "@/components/InfoCard";
import { Button } from "@/components/Button";
import {motion} from "framer-motion";

const ContactSection = () => {
    const [focusedField, setFocusedField] = React.useState<string | null>(null);
    return (
        <Section
            id="contact"
            tone="dark"
            maxWidth="6xl"
        >
            <SectionHeader
                id="contact-heading"
                eyebrow="Contact"
                title="Let’s work together"
                tone="dark"
                description="For collaborations, job opportunities or project enquiries, feel free to reach out by email or schedule a short call."
            />

            <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
                <div className="space-y-6">
                    <InfoCard title="Email" >
                        <a
                            href="mailto:mlourdesynigo@gmail.com"
                            className="text-base md:text-lg font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-800"
                        >
                            mlourdesynigo@gmail.com
                        </a>

                        <p className="mt-3 text-xs md:text-sm text-slate-600">
                            Preferred way to get in touch. I usually reply within 1–2 business days.
                        </p>
                    </InfoCard>

                    <InfoCard title="Details" >
                        <div className="text-sm md:text-base text-slate-800">
                            <p>Based in Queensland, Australia.</p>
                            <p>Available for remote and local collaboration.</p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button asChild>
                                <Link href="https://calendly.com/mlourdesynigo/30min">
                                    Schedule a Call
                                </Link>
                            </Button>
                        </div>
                    </InfoCard>
                </div>

                <InfoCard title="Quick message" >
                    <form className="space-y-4">
                        {["name", "email", "message"].map((field) => (
                            <motion.div
                                key={field}
                                className="space-y-1.5"
                                animate={{
                                    scale: focusedField === field ? 1.01 : 1
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <label
                                    htmlFor={`contact-${field}`}
                                    className="text-xs uppercase tracking-[0.2em] text-slate-500"
                                >
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>

                                {field === "message" ? (
                                    <motion.textarea
                                        id={`contact-${field}`}
                                        name={field}
                                        rows={4}
                                        required
                                        onFocus={() => setFocusedField(field)}
                                        onBlur={() => setFocusedField(null)}
                                        whileFocus={{ boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.1)" }}
                                        className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none resize-none transition-all"
                                    />
                                ) : (
                                    <motion.input
                                        id={`contact-${field}`}
                                        name={field}
                                        type={field === "email" ? "email" : "text"}
                                        required
                                        onFocus={() => setFocusedField(field)}
                                        onBlur={() => setFocusedField(null)}
                                        whileFocus={{ boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.1)" }}
                                        className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none transition-all"
                                    />
                                )}
                            </motion.div>
                        ))}

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" className="mt-2 w-full">
                                Send Message
                            </Button>
                        </motion.div>
                    </form>
                </InfoCard>
            </div>
        </Section>
);
};

export default ContactSection;
