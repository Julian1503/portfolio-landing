import * as React from "react";
import Link from "next/link";

type ProjectCardProps = {
    slug: string;
    title: string;
    tag: string;
    location: string;
    year: string;
    image: string;
};

export function ProjectCard({
                                slug,
                                title,
                                tag,
                                location,
                                year,
                                image,
                            }: ProjectCardProps) {
    return (
        <article className="relative">
            <Link
                href={`/projects/${slug}`}
                className="group block rounded-2xl overflow-hidden bg-white/60
                   border border-white/70 shadow-lg backdrop-blur-sm
                   transition-transform duration-300 motion-safe:hover:-translate-y-1
                   motion-safe:hover:shadow-2xl focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-offset-2
                   focus-visible:ring-slate-900"
                aria-label={`${title} – ${tag} project`}
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80"
                        aria-hidden="true"
                    />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <div className="flex flex-col gap-2">
            <span className="inline-flex px-3 py-1 rounded-full text-[10px] md:text-xs
                             tracking-[0.25em] uppercase bg-black/40 text-white/90
                             border border-white/30">
              {tag}
            </span>

                        <h3 className="text-lg md:text-xl font-semibold text-white leading-snug">
                            {title}
                        </h3>

                        <div className="flex items-center justify-between text-xs md:text-sm text-gray-100/90">
                            <span>{location}</span>
                            <span>{year}</span>
                        </div>

                        <span className="mt-1 inline-flex items-center text-xs md:text-sm text-gray-100/90 opacity-80 group-hover:opacity-100">
              View project
              <span
                  className="ml-1 translate-x-0 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
              >
                →
              </span>
            </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
