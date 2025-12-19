import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

type ProjectHeaderProps = {
    adjacent: {
        prev: { slug: string; title: string } | null;
        next: { slug: string; title: string } | null;
    };
};

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ adjacent }) => {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/#projects" className="group flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back to Projects</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {adjacent.prev && (
                            <Link
                                href={`/projects/${adjacent.prev.slug}`}
                                className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                                title={adjacent.prev.title}
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Previous</span>
                            </Link>
                        )}
                        {adjacent.next && (
                            <Link
                                href={`/projects/${adjacent.next.slug}`}
                                className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                                title={adjacent.next.title}
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
