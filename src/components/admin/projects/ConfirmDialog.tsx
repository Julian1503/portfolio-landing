"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { ModalPortal } from "./ModalPortal";
import {useLockBodyScroll, useModalKeyboardAndFocus} from "@/hooks/modalUtils";

type ConfirmDialogProps = {
    open: boolean;
    onCloseAction: () => void;
    onConfirmAction: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    icon?: React.ReactNode;
};

export function ConfirmDialog({
                                  open,
                                  onCloseAction,
                                  onConfirmAction,
                                  title,
                                  message,
                                  confirmText = "Confirm",
                                  cancelText = "Cancel",
                                  variant = "danger",
                                  icon,
                              }: ConfirmDialogProps) {
    const panelRef = React.useRef<HTMLDivElement>(null);

    useLockBodyScroll(open);
    useModalKeyboardAndFocus(open, onCloseAction, panelRef, false);
    const variantStyles = {
        danger: { iconBg: "bg-red-100", iconColor: "text-red-600", buttonBg: "bg-red-600 hover:bg-red-700" },
        warning: { iconBg: "bg-amber-100", iconColor: "text-amber-600", buttonBg: "bg-amber-600 hover:bg-amber-700" },
        info: { iconBg: "bg-blue-100", iconColor: "text-blue-600", buttonBg: "bg-blue-600 hover:bg-blue-700" },
    } as const;

    const styles = variantStyles[variant];
    const defaultIcon = <AlertTriangle className="w-6 h-6" />;

    return (
        <ModalPortal>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={onCloseAction}
                    >
                        <motion.div
                            ref={panelRef}
                            tabIndex={-1}
                            role="dialog"
                            aria-modal="true"
                            aria-label={title}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 outline-none"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-full ${styles.iconBg}`}>
                                    <div className={styles.iconColor}>{icon || defaultIcon}</div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                            </div>

                            <p className="text-sm text-slate-600 mb-6">{message}</p>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onCloseAction}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onConfirmAction}
                                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-lg ${styles.buttonBg}`}
                                >
                                    {confirmText}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalPortal>
    );
}
