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
                           type = "button",
                           ...props
                       }: ButtonProps) {
    const isDisabled = disabled || isLoading;

    // Estilos base
    const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold tracking-wide uppercase transition-all duration-300 px-5 py-2.5 text-xs md:text-sm";

    // Estilos por variante
    let variantStyles = "";
    if (variant === "primary") {
        variantStyles = "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 shadow-md hover:shadow-lg";
    } else if (variant === "secondary") {
        variantStyles = "border-2 border-slate-900 text-slate-900 bg-transparent hover:bg-slate-900 hover:text-white disabled:border-slate-300 disabled:text-slate-500";
    }

    // Estilos de focus
    const focusStyles = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900";

    // Estilos de movimiento
    const motionStyles = "motion-safe:hover:-translate-y-[1px] motion-safe:active:translate-y-0";

    // Combinar todos los estilos
    const allStyles = `${baseStyles} ${variantStyles} ${focusStyles} ${motionStyles} ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`;

    const content = isLoading ? (
        <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
            <span>{children}</span>
        </span>
    ) : (
        children
    );

    if (asChild) {
        return (
            <Slot className={allStyles} {...props}>
                {children}
            </Slot>
        );
    }

    return (
        <button
            type={type}
            className={allStyles}
            disabled={isDisabled}
            {...props}
        >
            {content}
        </button>
    );
}