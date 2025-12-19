"use client";

import React, { useEffect, useRef } from "react";

type HeroBackgroundProps = {
    backgroundImage?: string | null;
    backgroundVideo?: string | null;
};

const HeroBackground = ({ backgroundImage, backgroundVideo }: HeroBackgroundProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current
            .play()
            .catch(() => {
                // Ignore autoplay restrictions silently
            });
    }, []);

    // Default fallbacks
    const videoSrc = backgroundVideo || "/videos/hero-b.mp4";
    const posterSrc = backgroundImage || "/img/Hero.png";

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
                poster={posterSrc}
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        </div>
    );
};

export default HeroBackground;
