"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ModalPortal } from "./ModalPortal";
import {useLockBodyScroll, useModalKeyboardAndFocus} from "@/hooks/modalUtils";

type ModalProps = {
    open: boolean;
    onCloseAction: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    preventClose?: boolean;
};

const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
};

export function Modal({
                          open,
                          onCloseAction,
                          title,
                          children,
                          maxWidth = "lg",
                          preventClose = false,
                      }: ModalProps) {
    const panelRef = React.useRef<HTMLDivElement>(null);

    useLockBodyScroll(open);
    useModalKeyboardAndFocus(open, onCloseAction, panelRef, preventClose);

    const handleOverlayClick = () => {
        if (!preventClose) onCloseAction();
    };

    const handleCloseClick = () => {
        if (!preventClose) onCloseAction();
    };

    return (
        <ModalPortal>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={handleOverlayClick}
                    >
                        <motion.div
                            ref={panelRef}
                            tabIndex={-1}
                            role="dialog"
                            aria-modal="true"
                            aria-label={title}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full ${maxWidthClasses[maxWidth]} rounded-2xl bg-white shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto outline-none`}
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white/95 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                                <button
                                    onClick={handleCloseClick}
                                    disabled={preventClose}
                                    aria-label="Close modal"
                                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">{children}</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalPortal>
    );
}
