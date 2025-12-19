// src/hooks/usePageVisibility.ts
"use client";

import { useEffect, useState, useCallback } from "react";

export function usePageVisibility(onVisible?: () => void) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            const visible = !document.hidden;
            setIsVisible(visible);

            if (visible && onVisible) {
                onVisible();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [onVisible]);

    return isVisible;
}