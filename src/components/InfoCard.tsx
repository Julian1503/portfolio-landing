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
        "rounded-2xl bg-white backdrop-blur-sm shadow-lg p-5 md:p-6 transition-all duration-300 hover:shadow-xl";

    const variants: Record<NonNullable<InfoCardProps["variant"]>, string> = {
        // Para fondos oscuros (como About Me con tone="dark")
        primary: "border-2 border-white/30 hover:border-white/50",

        // Para fondos claros (como Contact con tone="light")
        light: "border-2 border-slate-200 hover:border-slate-300",

        // Alternativa
        secondary: "border-2 border-slate-300 hover:border-slate-400",
    };

    const titleColors: Record<NonNullable<InfoCardProps["variant"]>, string> = {
        primary: "text-slate-100 mb-3",
        light: "text-slate-500 mb-3",
        secondary: "text-slate-500 mb-3",
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