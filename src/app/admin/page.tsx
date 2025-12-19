"use client";

import React from "react";
import { AdminLayout, AdminSectionId } from "@/components/admin/AdminLayout";
import { ProjectsAdminSection } from "@/components/admin/projects/ProjectsAdminSection";
import {
    HeroAdminSection,
    AboutAdminSection,
    ContactAdminSection,
    FooterAdminSection,
    ThemeAdminSection,
} from "@/components/admin/cms";

const sections = [
    { id: "hero" as AdminSectionId, label: "Hero / Profile" },
    { id: "about" as AdminSectionId, label: "About" },
    { id: "projects" as AdminSectionId, label: "Projects" },
    { id: "contact" as AdminSectionId, label: "Contact" },
    { id: "navigation" as AdminSectionId, label: "Navigation" },
    { id: "footer" as AdminSectionId, label: "Footer" },
    { id: "theme" as AdminSectionId, label: "Theme / Design" },
];

export default function AdminPage() {
    const [active, setActive] = React.useState<AdminSectionId>("hero");

    return (
        <AdminLayout
            sections={sections}
            activeSection={active}
            onChangeSection={setActive}
        >
            {active === "hero" && <HeroAdminSection />}
            {active === "about" && <AboutAdminSection />}
            {active === "projects" && <ProjectsAdminSection />}
            {active === "contact" && <ContactAdminSection />}
            {active === "footer" && <FooterAdminSection />}
            {active === "theme" && <ThemeAdminSection />}
            {active === "navigation" && (
                <p className="text-xs text-slate-500">
                    Navigation section - not yet implemented
                </p>
            )}
        </AdminLayout>
    );
}
