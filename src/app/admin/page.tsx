"use client";

import React from "react";
import { AdminLayout, AdminSectionId } from "@/components/admin/AdminLayout";
import { ProjectsAdminSection } from "@/components/admin/projects/ProjectsAdminSection";

const sections = [
    { id: "hero" as AdminSectionId, label: "Hero / Profile" },
    { id: "about" as AdminSectionId, label: "About" },
    { id: "projects" as AdminSectionId, label: "Projects" },
    { id: "contact" as AdminSectionId, label: "Contact" },
    { id: "navigation" as AdminSectionId, label: "Navigation" },
    { id: "footer" as AdminSectionId, label: "Footer" },
];

export default function AdminPage() {
    const [active, setActive] = React.useState<AdminSectionId>("projects");

    return (
        <AdminLayout
            sections={sections}
            activeSection={active}
            onChangeSection={setActive}
        >
            {active === "projects" && <ProjectsAdminSection />}
            {active !== "projects" && (
                <p className="text-xs text-slate-500">
                    (Todavía no implementado) — esta sección va a usar los mismos
                    componentes genéricos con otra config.
                </p>
            )}
        </AdminLayout>
    );
}
