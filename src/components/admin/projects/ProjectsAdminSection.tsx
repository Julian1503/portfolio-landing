"use client";

import React from "react";
import { DataTable, Column } from "../DataTable";
import { EntityModalForm, FieldConfig } from "../EntityModalForm";
import type { ProjectDTO, ProjectCardDTO } from "@/types/ProjectDTO";
import { useRouter } from 'next/navigation';
import {PROJECT_TYPES, PROJECT_STATUS, PROJECT_TYPE} from "@/types/projectEnums";

const PAGE_SIZE = 6;

export function ProjectsAdminSection() {
    const [projects, setProjects] = React.useState<ProjectCardDTO[]>([]);
    const [page, setPage] = React.useState(0);
    const router = useRouter();
    const mountedRef = React.useRef(false);
    const [modalMode, setModalMode] = React.useState<"create" | "edit" | null>(null);

    const [selected, setSelected] = React.useState<ProjectDTO | null>(null);
    const [isMutating, setIsMutating] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const [sort, setSort] = React.useState<{
        key: keyof ProjectCardDTO | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });

    // ───────────────────── fetch projects list ─────────────────────
    const fetchProjects = React.useCallback(async () => {
        try {
            const res = await fetch("/api/projects");
            if (!res.ok) {
                console.error("Failed to fetch projects");
                return;
            }
            const data: ProjectCardDTO[] = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    }, []);

    React.useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;
        fetchProjects();
    }, [fetchProjects]);

    // ───────────────────── fetch full project for edit ─────────────────────
    const fetchProjectById = React.useCallback(async (id: string) => {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to fetch project");
        return (await res.json()) as ProjectDTO;
    }, []);

    // ───────────────────── search ─────────────────────
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredProjects = React.useMemo(() => {
        if (!normalizedQuery) return projects;
        return projects.filter((p) => {
            const values = [p.title, p.tag, p.location, p.year, p.slug];
            return values.some((v) => (v ?? "").toLowerCase().includes(normalizedQuery));
        });
    }, [projects, normalizedQuery]);

    // ───────────────────── sort (3 states) ─────────────────────
    const sortedProjects = React.useMemo(() => {
        if (!sort.key) return filteredProjects;

        const copy = [...filteredProjects];
        copy.sort((a, b) => {
            const aVal = (a[sort.key!] ?? "").toString().toLowerCase();
            const bVal = (b[sort.key!] ?? "").toString().toLowerCase();
            const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: "base" });
            return sort.direction === "asc" ? cmp : -cmp;
        });
        return copy;
    }, [filteredProjects, sort]);

    const pageCount = Math.max(1, Math.ceil(sortedProjects.length / PAGE_SIZE));
    const startIndex = page * PAGE_SIZE;
    const pageItems = sortedProjects.slice(startIndex, startIndex + PAGE_SIZE);

    // ───────────────────── columns ─────────────────────
    const columns: Column<ProjectCardDTO>[] = [
        { key: "title", header: "Title" },
        { key: "tag", header: "Tag" },
        { key: "location", header: "Location" },
        { key: "year", header: "Year" },
        { key: "slug", header: "Slug" },
        { key: "isFeatured", header: "★", render: (row) => row.isFeatured ? "⭐" : "" },
        {
            key: "coverImage",
            header: "Cover",
            render: (row) =>
                row.coverImage ? (
                    <img
                        src={row.coverImage}
                        alt={row.title}
                        className="h-10 w-14 rounded-md object-cover border border-slate-200"
                    />
                ) : (
                    <span className="text-slate-400">—</span>
                ),
        },
    ];

    // ───────────────────── fields (modal) ─────────────────────
    const humanize = (s: string) =>
        s
            .toLowerCase()
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    const enumToOptions = (en: Record<string, string>) =>
        Object.values(en)
            .filter((v): v is string => typeof v === "string")
            .map((v) => ({ value: v, label: humanize(v) }));

    const fields: FieldConfig<ProjectDTO>[] = [
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug", required: true },
        { name: "tag", label: "Tag", required: true },
        { name: "location", label: "Location", required: true },
        { name: "year", label: "Year", required: true },

        { name: "excerpt", label: "Short description (excerpt)", required: false },
        { name: "description", label: "Full description", required: false, inputProps: { as: "textarea" } },

        { name: "status", label: "Status", required: true, inputProps: { as: "select", options: enumToOptions(PROJECT_STATUS) } },
        { name: "type", label: "Type", required: false, inputProps: { as: "select", options: enumToOptions(PROJECT_TYPE) } },

        { name: "role", label: "Your role", required: false },
        { name: "client", label: "Client", required: false },

        { name: "tools", label: "Tools (comma separated)", required: false },
        { name: "isFeatured", label: "Featured", required: false, inputProps: { type: "checkbox" } },

        { name: "coverImage", label: "Cover image", required: false, inputProps: { type: "file" } },
    ];


    // ───────────────────── UI helpers ─────────────────────
    const openCreate = () => {
        if (isMutating) return;
        setSelected(null);
        setModalMode("create");
    };

    const openEdit = async (row: ProjectCardDTO) => {
        router.push(`/admin/projects/${row.id}`);
    };

    const closeModal = () => {
        if (isMutating) return;
        setSelected(null);
        setModalMode(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(0);
    };

    const handleSortChange = (key: keyof ProjectCardDTO) => {
        setPage(0);
        setSort((prev) => {
            if (prev.key !== key) return { key, direction: "asc" };
            if (prev.direction === "asc") return { key, direction: "desc" };
            return { key: null, direction: "asc" };
        });
    };

    // ───────────────────── upload ─────────────────────
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Error uploading image");

        const data = await res.json();
        return data.url as string;
    };

    // ───────────────────── submit ─────────────────────
    const handleSubmit = async (formData: FormData) => {
        if (isMutating) return;
        setIsMutating(true);

        try {
            const isCreate = modalMode === "create";

            const title = (formData.get("title") ?? "").toString();
            const slug = (formData.get("slug") ?? "").toString();
            const tag = (formData.get("tag") ?? "").toString();
            const location = (formData.get("location") ?? "").toString();
            const year = (formData.get("year") ?? "").toString();

            // ✅ FIX: el input se llama "coverImage"
            const coverFile = formData.get("coverImage");
            let coverImage = selected?.coverImage ?? undefined;

            if (coverFile instanceof File && coverFile.size > 0) {
                coverImage = await uploadImage(coverFile);
            }

            // payload mínimo para create/update (lo demás lo sumamos luego en UI)
            const payload = {
                title,
                slug,
                tag,
                location,
                year,
                coverImage,
                // defaults razonables para schema nuevo
                status: selected?.status ?? "CONCEPT",
                tools: selected?.tools ?? [],
            };

            const url = isCreate ? "/api/projects" : `/api/projects/${selected?.id}`;
            const method = isCreate ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                console.error("Error saving project");
                return;
            }

            await fetchProjects();
            closeModal();
        } catch (error) {
            console.error("Error saving project", error);
        } finally {
            setIsMutating(false);
        }
    };

    // ───────────────────── delete ─────────────────────
    const handleDelete = async (row: ProjectCardDTO) => {
        if (isMutating) return;
        setIsMutating(true);
        try {
            const res = await fetch(`/api/projects/${row.id}`, { method: "DELETE" });
            if (!res.ok) {
                console.error("Error deleting project");
                return;
            }
            await fetchProjects();
        } catch (error) {
            console.error("Error deleting project", error);
        } finally {
            setIsMutating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Projects</h2>
                    <p className="mt-1 max-w-md text-xs text-slate-500 sm:text-sm">
                        Gestioná los proyectos que se muestran en el portfolio.
                    </p>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        placeholder="Search…"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        disabled={isMutating}
                        className="w-full rounded-full border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400/70 disabled:bg-slate-100 disabled:text-slate-400 sm:text-sm"
                    />

                    <div className="flex items-center gap-3">
                        {isMutating && (
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 sm:text-xs">
                <span
                    className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
                    aria-hidden="true"
                />
                                <span>Working on your changes…</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={openCreate}
                            disabled={isMutating}
                            className={`self-start rounded-full px-4 py-2 text-xs font-semibold shadow-sm sm:self-auto sm:text-sm ${
                                isMutating
                                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                        >
                            + New Project
                        </button>
                    </div>
                </div>
            </div>

            <DataTable<ProjectCardDTO>
                columns={columns}
                data={pageItems}
                getRowId={(row) => row.id}
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={sortedProjects.length}
                onPageChange={setPage}
                renderRowActions={(row) => (
                    <>
                        <button
                            onClick={() => openEdit(row)}
                            className={`font-semibold hover:underline ${
                                isMutating ? "cursor-not-allowed text-slate-300" : "text-slate-900"
                            }`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row)}
                            disabled={isMutating}
                            className={`hover:underline ${
                                isMutating ? "cursor-not-allowed text-red-200" : "text-red-500"
                            }`}
                        >
                            Delete
                        </button>
                    </>
                )}
                emptyMessage={normalizedQuery ? "No projects match your search." : "No projects yet."}
                sortKey={sort.key ?? undefined}
                sortDirection={sort.key ? sort.direction : undefined}
                onSortChange={handleSortChange}
            />

            <EntityModalForm<ProjectDTO>
                mode={modalMode ?? "create"}
                title="project"
                open={modalMode !== null}
                initialValues={selected ?? undefined}
                fields={fields}
                onClose={closeModal}
                onSubmit={handleSubmit}
                submitting={isMutating}
            />
        </div>
    );
}
