import * as React from "react";

type SectionHeaderProps = {
    id: string; // este id se usa también en aria-labelledby del Section
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

    const titleColor =
        tone === "dark" ? "text-slate-200" : "text-slate-900";
    const descColor =
        tone === "dark" ? "text-slate-400" : "text-slate-700";

    return (
        <header className={`mb-10 md:mb-14 flex flex-col gap-2 ${alignment}`}>
      <span className="text-xs md:text-sm tracking-[0.35em] uppercase text-slate-500">
        {eyebrow}
      </span>
            {
                title && (
                    <h2
                        id={id}
                        className={`text-3xl md:text-4xl font-extrabold tracking-tight uppercase ${titleColor}`}
                    >
                        {title}
                    </h2>
                )
            }
            {description && (
                <p className={`text-sm md:text-base ${descColor} max-w-2xl`}>
                    {description}
                </p>
            )}
        </header>
    );
}
