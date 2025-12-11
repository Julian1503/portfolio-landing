"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const Hero = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const reduceMotion = useReducedMotion();

    // Intentar reproducir el video en cuanto se monta (por si el autoplay no se dispara solo)
    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current
            .play()
            .catch(() => {
                // si el navegador bloquea autoplay, lo ignoramos
            });
    }, []);

    return (
        <section className="relative w-full h-[100svh] min-h-[540px] overflow-hidden bg-white">
            {/* Fondo video */}
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

                {/* Degradé para legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 h-full">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-center md:justify-start px-4 sm:px-6 md:px-10 lg:px-16">
                    <div className="w-full max-w-sm sm:max-w-md md:max-w-xl">
                        {/* CARD ANIMADO */}
                        <motion.div
                            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                            animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col gap-3 p-4 sm:p-6 md:p-8 rounded-2xl
                         bg-black/25 backdrop-blur-sm border border-white/15
                         shadow-2xl"
                        >
              <span className="text-[10px] sm:text-xs md:text-sm tracking-[0.35em] text-gray-200 uppercase">
                Portfolio
              </span>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase">
                                Maria Lourdes
                                <br />
                                Ynigo
                            </h1>

                            <div className="flex flex-wrap items-center mt-2 gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase px-3 sm:px-4 py-1 rounded-full border border-white/30 text-white/90 bg-black/20">
                  Architect
                </span>
                                <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] uppercase px-3 sm:px-4 py-1 rounded-full border border-white/30 text-white/90 bg-black/20">
                  Architecture Technician
                </span>
                            </div>

                            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-100/90 max-w-xl">
                                Residential and commercial design with a focus on context, light
                                and everyday life.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
