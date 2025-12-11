"use client";

import React from "react";
import { DataTable, Column } from "../DataTable";
import { EntityModalForm, FieldConfig } from "../EntityModalForm";

export type ProjectDTO = {
    id: string;
    slug: string;
    title: string;
    tag: string;
    location: string;
    year: string;
    image: string; // URL de Cloudinary
};

const PAGE_SIZE = 6;

export function ProjectsAdminSection() {
    const [projects, setProjects] = React.useState<ProjectDTO[]>([]);
    const [page, setPage] = React.useState(0);
    const [modalMode, setModalMode] =
        React.useState<"create" | "edit" | null>(null);
    const [selected, setSelected] = React.useState<ProjectDTO | null>(null);
    const [isMutating, setIsMutating] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const [sort, setSort] = React.useState<{
        key: keyof ProjectDTO | null;
        direction: "asc" | "desc";
    }>({
        key: null,
        direction: "asc",
    });

    // ───────────────────── fetch de proyectos ─────────────────────
    const fetchProjects = React.useCallback(async () => {
        try {
            const res = await fetch("/api/projects");
            if (!res.ok) {
                console.error("Failed to fetch projects");
                return;
            }
            const data: ProjectDTO[] = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    }, []);

    React.useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // ───────────────────── filtro por búsqueda ─────────────────────
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredProjects = React.useMemo(() => {
        if (!normalizedQuery) return projects;
        return projects.filter((p) => {
            const values = [p.title, p.tag, p.location, p.year, p.slug];
            return values.some((v) => v.toLowerCase().includes(normalizedQuery));
        });
    }, [projects, normalizedQuery]);

    // ───────────────────── ordenamiento 3 estados ─────────────────────
    const sortedProjects = React.useMemo(() => {
        if (!sort.key) return filteredProjects;

        const copy = [...filteredProjects];
        copy.sort((a, b) => {
            const aVal = (a[sort.key!] ?? "").toString().toLowerCase();
            const bVal = (b[sort.key!] ?? "").toString().toLowerCase();
            const cmp = aVal.localeCompare(bVal, undefined, {
                numeric: true,
                sensitivity: "base",
            });
            return sort.direction === "asc" ? cmp : -cmp;
        });
        return copy;
    }, [filteredProjects, sort]);

    const pageCount = Math.max(1, Math.ceil(sortedProjects.length / PAGE_SIZE));
    const startIndex = page * PAGE_SIZE;
    const pageItems = sortedProjects.slice(startIndex, startIndex + PAGE_SIZE);

    // ───────────────────── columnas & campos ─────────────────────
    const columns: Column<ProjectDTO>[] = [
        { key: "title", header: "Title" },
        { key: "tag", header: "Tag" },
        { key: "location", header: "Location" },
        { key: "year", header: "Year" },
        { key: "slug", header: "Slug" },
        { key: "image", header: "Image" },
    ];

    const fields: FieldConfig<ProjectDTO>[] = [
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug", required: true },
        { name: "tag", label: "Tag", required: true },
        { name: "location", label: "Location", required: true },
        { name: "year", label: "Year", required: true },
        {
            name: "image",
            label: "Image (upload or leave empty to keep current)",
            required: modalMode === "create",
            inputProps: {
                type: "file",
                accept: "image/*",
            },
        },
    ];

    // ───────────────────── helpers UI ─────────────────────
    const openCreate = () => {
        if (isMutating) return;
        setSelected(null);
        setModalMode("create");
    };

    const openEdit = (row: ProjectDTO) => {
        if (isMutating) return;
        setSelected(row);
        setModalMode("edit");
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

    const handleSortChange = (key: keyof ProjectDTO) => {
        setPage(0);
        setSort((prev) => {
            // columna nueva → asc
            if (prev.key !== key) {
                return { key, direction: "asc" };
            }
            // misma columna → ciclo asc -> desc -> none
            if (prev.direction === "asc") {
                return { key, direction: "desc" }; // asc -> desc
            }
            // desc -> sin orden (key null) y dejamos asc listo para el próximo
            return { key: null, direction: "asc" };
        });
    };

    // ───────────────────── Cloudinary upload ─────────────────────
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Error uploading image");
        }

        const data = await res.json();
        return data.url as string;
    };

    // ───────────────────── Create / Edit ─────────────────────
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

            const imageFile = formData.get("image");
            let imageUrl = selected?.image ?? "";

            if (imageFile instanceof File && imageFile.size > 0) {
                imageUrl = await uploadImage(imageFile);
            }

            if (isCreate && !imageUrl) {
                throw new Error("Image is required for new projects");
            }

            const payload = {
                title,
                slug,
                tag,
                location,
                year,
                image: imageUrl,
            };

            const url = isCreate
                ? "/api/projects"
                : `/api/projects/${selected?.id}`;
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
            setModalMode(null);
            setSelected(null);
        } catch (error) {
            console.error("Error saving project", error);
        } finally {
            setIsMutating(false);
        }
    };

    // ───────────────────── Delete ─────────────────────
    const handleDelete = async (row: ProjectDTO) => {
        if (isMutating) return;
        setIsMutating(true);
        try {
            const res = await fetch(`/api/projects/${row.id}`, {
                method: "DELETE",
            });

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
            {/* Header */}
            <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                        Projects
                    </h2>
                    <p className="mt-1 max-w-md text-xs text-slate-500 sm:text-sm">
                        Gestioná los proyectos que se muestran en el portfolio.
                    </p>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            disabled={isMutating}
                            className="w-full rounded-full border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400/70 disabled:bg-slate-100 disabled:text-slate-400 sm:text-sm"
                        />
                    </div>

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

            {/* Tabla */}
            <DataTable<ProjectDTO>
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
                            disabled={isMutating}
                            className={`font-semibold hover:underline ${
                                isMutating
                                    ? "cursor-not-allowed text-slate-300"
                                    : "text-slate-900"
                            }`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row)}
                            disabled={isMutating}
                            className={`hover:underline ${
                                isMutating
                                    ? "cursor-not-allowed text-red-200"
                                    : "text-red-500"
                            }`}
                        >
                            Delete
                        </button>
                    </>
                )}
                emptyMessage={
                    normalizedQuery ? "No projects match your search." : "No projects yet."
                }
                sortKey={sort.key ?? undefined}
                sortDirection={sort.key ? sort.direction : undefined}
                onSortChange={handleSortChange}
            />

            {/* Modal */}
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
