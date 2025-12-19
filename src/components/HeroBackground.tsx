"use client";

import React, { useEffect, useRef } from "react";

const HeroBackground = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current
            .play()
            .catch(() => {
                // Ignore autoplay restrictions silently
            });
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                preload="metadata"
                playsInline
                muted
                loop
                autoPlay
                poster="/img/Hero.png"
            >
                <source src="/videos/hero-b.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        </div>
    );
};

export default HeroBackground;
