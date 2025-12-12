"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonProps = {
    asChild?: boolean;
    variant?: "primary" | "secondary";
    isLoading?: boolean;
    className?: string;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
                           asChild = false,
                           variant = "primary",
                           isLoading = false,
                           className = "",
                           children,
                           disabled,
                           ...props
                       }: ButtonProps) {
    const Component = asChild ? Slot : "button";

    const isDisabled = disabled || isLoading;

    const base =
        "inline-flex items-center justify-center rounded-full text-xs md:text-sm font-semibold tracking-wide uppercase transition px-5 py-2.5";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
        primary:
            "bg-accent text-white hover:bg-accent-dark aria-disabled:bg-slate-300 aria-disabled:text-slate-500 shadow-md shadow-accent/20",
        secondary:
            "border-2 border-accent text-accent bg-white/60 backdrop-blur-sm hover:bg-accent hover:text-white aria-disabled:border-slate-300 aria-disabled:text-slate-500",
    };

    const focusStyles =
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 focus-visible:ring-offset-background";

    const motionSafe = "motion-safe:hover:-translate-y-[0.5px]";

    return (
        <Component
            className={[
                base,
                variants[variant],
                focusStyles,
                motionSafe,
                isDisabled ? "cursor-not-allowed opacity-80" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-disabled={isDisabled || undefined}
            aria-busy={isLoading || undefined}
            disabled={!asChild ? isDisabled : undefined}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-white/60 border-t-transparent animate-spin" aria-hidden="true" />
          <span>{children}</span>
        </span>
            ) : (
                children
            )}
        </Component>
    );
}
