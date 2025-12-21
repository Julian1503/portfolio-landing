"use client";

import React from "react";

const FOCUSABLE_SELECTOR =
    'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),iframe,object,embed,[contenteditable="true"],[tabindex]:not([tabindex="-1"])';

export function useModalKeyboardAndFocus(
    open: boolean,
    onCloseAction: () => void,
    panelRef: React.RefObject<HTMLElement | null>,
    preventClose = false
) {
    const lastActiveRef = React.useRef<HTMLElement | null>(null);
    const onCloseRef = React.useRef(onCloseAction);
    const didAutoFocusRef = React.useRef(false);

    React.useEffect(() => {
        onCloseRef.current = onCloseAction;
    }, [onCloseAction]);

    React.useEffect(() => {
        if (!open) {
            didAutoFocusRef.current = false;
            return;
        }

        lastActiveRef.current = document.activeElement as HTMLElement | null;

        const focusPanelOnce = () => {
            if (didAutoFocusRef.current) return;

            const panel = panelRef.current;
            if (!panel) return;

            const focusables = Array.from(
                panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

            (focusables[0] ?? panel).focus();
            didAutoFocusRef.current = true;
        };

        const raf = requestAnimationFrame(focusPanelOnce);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (!preventClose) {
                    e.preventDefault();
                    onCloseRef.current();
                }
                return;
            }

            if (e.key !== "Tab") return;

            const panel = panelRef.current;
            if (!panel) return;

            const focusables = Array.from(
                panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

            if (focusables.length === 0) {
                e.preventDefault();
                return;
            }

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown, true);

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener("keydown", onKeyDown, true);
            lastActiveRef.current?.focus?.();
            didAutoFocusRef.current = false;
        };
    }, [open, panelRef, preventClose]);
}

export function useLockBodyScroll(locked: boolean) {
    React.useEffect(() => {
        if (!locked) return;

        const { body, documentElement } = document;
        const prevOverflow = body.style.overflow;
        const prevPaddingRight = body.style.paddingRight;

        const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

        body.style.overflow = "hidden";
        if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPaddingRight;
        };
    }, [locked]);
}
