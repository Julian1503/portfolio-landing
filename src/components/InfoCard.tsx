import * as React from "react";

type InfoCardProps = {
    title: string;
    variant?: "primary" | "secondary" | "light";
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
        "rounded-2xl bg-[var(--theme-surface)] backdrop-blur-sm shadow-lg p-5 md:p-6 transition-all duration-300 hover:shadow-xl";

    const variants: Record<NonNullable<InfoCardProps["variant"]>, string> = {
        // Para fondos oscuros (como About Me con tone="dark")
        primary: "border-2 border-[var(--theme-border)] hover:border-[var(--theme-primary)]",

        // Para fondos claros (como Contact con tone="light")
        light: "border-2 border-[var(--theme-border)] hover:border-[var(--theme-primary)]",

        // Alternativa
        secondary: "border-2 border-[var(--theme-border-light)] hover:border-[var(--theme-border)]",
    };

    const titleColors: Record<NonNullable<InfoCardProps["variant"]>, string> = {
        primary: "text-[var(--theme-text-muted)] mb-3",
        light: "text-[var(--theme-text-muted)] mb-3",
        secondary: "text-[var(--theme-text-muted)] mb-3",
    };

    const headingId = "card-" + title.toLowerCase().replace(/\s+/g, "-");

    return (
        <section
            className={`${base} ${variants[variant]} ${className}`}
            aria-labelledby={headingId}
            role="group"
        >
            <h3
                id={headingId}
                className={`text-xs tracking-[0.25em] uppercase font-semibold ${titleColors[variant]}`}
            >
                {title}
            </h3>
            <div className="text-sm md:text-base">
                {children}
            </div>
        </section>
    );
}