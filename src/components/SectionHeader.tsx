// En SectionHeader.tsx
import * as React from "react";

type SectionHeaderProps = {
    id: string;
    eyebrow: string;
    title?: string;
    description?: string;
    align?: "left" | "center";
    tone?: "dark" | "light";
};

export function SectionHeader({
                                  id,
                                  eyebrow,
                                  title,
                                  description,
                                  align = "left",
                                  tone = "light",
                              }: SectionHeaderProps) {
    const alignment =
        align === "center"
            ? "items-center text-center"
            : "items-start text-left";

    // Colores usando variables de tema
    const eyebrowColor = "text-[var(--theme-primary)]";
    const titleColor = "text-[var(--theme-text)]";
    const descColor = "text-[var(--theme-text-secondary)]";

    return (
        <header className={`mb-10 md:mb-14 flex flex-col gap-3 ${alignment}`}>
            {/* Eyebrow con más énfasis */}
            <span className={`text-xs md:text-sm font-semibold tracking-[0.35em] uppercase ${eyebrowColor}`}>
                {eyebrow}
            </span>

            {title && (
                <h2
                    id={id}
                    className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight ${titleColor} leading-tight`}
                >
                    {title}
                </h2>
            )}

            {description && (
                <p className={`text-sm md:text-base leading-relaxed ${descColor} max-w-2xl mt-1`}>
                    {description}
                </p>
            )}
        </header>
    );
}