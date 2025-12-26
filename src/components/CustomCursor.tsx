// src/components/CustomCursor.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (rafRef.current !== undefined) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });

                const target = e.target as HTMLElement;
                const newIsPointer =
                    window.getComputedStyle(target).cursor === 'pointer' ||
                    target.tagName === 'A' ||
                    target.tagName === 'BUTTON';

                if (newIsPointer !== isPointer) {
                    setIsPointer(newIsPointer);
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current !== undefined) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isPointer]);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{ backgroundColor: 'var(--theme-text)' }}
                animate={{
                    x: position.x - 8,
                    y: position.y - 8,
                    scale: isPointer ? 1.5 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 border-2 rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{ borderColor: 'var(--theme-text)' }}
                animate={{
                    x: position.x - 20,
                    y: position.y - 20,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            />
        </>
    );
}