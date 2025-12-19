import React from "react";
import { InfoCard } from "@/components/InfoCard";
import { Button } from "@/components/Button";

export const ContactForm = () => (
    <InfoCard title="Quick message" variant="light">
        <form
            className="space-y-4"
            aria-label="Quick contact form"
        >
            <div className="space-y-1.5">
                <label
                    htmlFor="contact-name"
                    className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium"
                >
                    Name
                </label>
                <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50
                     px-3 py-2.5 text-sm text-slate-900 outline-none
                     focus:border-slate-900 focus:bg-white transition-colors"
                    placeholder="Your name"
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="contact-email"
                    className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium"
                >
                    Email
                </label>
                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50
                     px-3 py-2.5 text-sm text-slate-900 outline-none
                     focus:border-slate-900 focus:bg-white transition-colors"
                    placeholder="your@email.com"
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="contact-message"
                    className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium"
                >
                    Message
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50
                     px-3 py-2.5 text-sm text-slate-900 outline-none
                     resize-none focus:border-slate-900 focus:bg-white transition-colors"
                    placeholder="Tell me briefly about your project or enquiry."
                />
            </div>

            <Button type="submit" className="mt-2 w-full">
                Send Message
            </Button>
        </form>
    </InfoCard>
);
