import * as React from "react";

type InfoCardProps = {
    title: string;
    variant?: "primary" | "secondary";
    children: React.ReactNode;
    className?: string;
};

export function InfoCard({
                             title,
                             variant = "primary",
                             children,
                             className = "",
                         }: InfoCardProps) {
    const base =
        "rounded-2xl border bg-white/70 backdrop-blur-sm shadow-lg p-5 md:p-6";

    const variants: Record<NonNullable<InfoCardProps["variant"]>, string> = {
        primary: "border-white/30",
        secondary: "border-white/70",
    };

    const titleColors: Record<NonNullable<InfoCardProps["variant"]>, string> = {
        primary: "text-slate-100 mb-2",
        secondary: "text-slate-500 mb-3",
    };

    // id estable a partir del título, simple pero útil
    const headingId =
        "card-" + title.toLowerCase().replace(/\s+/g, "-");

    return (
        <section
            className={`${base} ${variants[variant]} ${className}`}
            aria-labelledby={headingId}
            role="group"
        >
            <h3
                id={headingId}
                className={`text-xs tracking-[0.25em] uppercase ${titleColors[variant]}`}
            >
                {title}
            </h3>
            {children}
        </section>
    );
}
