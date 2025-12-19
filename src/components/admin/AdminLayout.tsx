"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";

export type AdminSectionId =
    | "hero"
    | "about"
    | "projects"
    | "contact"
    | "navigation"
    | "footer"
    | "theme";

export type AdminSection = {
    id: AdminSectionId;
    label: string;
};

type AdminLayoutProps = {
    sections: AdminSection[];
    activeSection: AdminSectionId;
    onChangeSection: (id: AdminSectionId) => void;
    children: React.ReactNode;
};

export function AdminLayout({
                                sections,
                                activeSection,
                                onChangeSection,
                                children,
                            }: AdminLayoutProps) {
    return (
        <main className="min-h-screen w-full bg-[#f5f5f5] text-slate-900">
            <div className="mx-auto flex flex-col md:flex-row max-w-6xl gap-4 md:gap-6 px-4 py-6 md:py-12">
                {/* Sidebar desktop */}
                <aside className="hidden max-h-max md:flex w-60 flex-shrink-0 flex-col rounded-2xl bg-white/90 border border-slate-200 shadow-sm">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500">
                                    Admin
                                </h2>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    Portfolio Panel
                                </p>
                            </div>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                    <nav className="flex-1 px-2 py-3 space-y-1">
                        {sections.map((s) => {
                            const isActive = s.id === activeSection;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => onChangeSection(s.id)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
                                        isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    {s.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Selector mobile */}
                <aside className="md:hidden w-full">
                    <div className="flex items-center gap-3 mb-3">
                        <select
                            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                            value={activeSection}
                            onChange={(e) =>
                                onChangeSection(e.target.value as AdminSectionId)
                            }
                        >
                            {sections.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </aside>

                {/* Panel derecho */}
                <section className="flex-1">
                    <div className="relative rounded-2xl bg-white/90 border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}
