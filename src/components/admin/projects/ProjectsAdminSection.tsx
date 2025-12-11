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
    const [modalMode, setModalMode] = React.useState<"create" | "edit" | null>(
        null
    );
    const [selected, setSelected] = React.useState<ProjectDTO | null>(null);

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

    const pageCount = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
    const startIndex = page * PAGE_SIZE;
    const pageItems = projects.slice(startIndex, startIndex + PAGE_SIZE);

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

    const openCreate = () => {
        setSelected(null);
        setModalMode("create");
    };

    const openEdit = (row: ProjectDTO) => {
        setSelected(row);
        setModalMode("edit");
    };

    const closeModal = () => {
        setSelected(null);
        setModalMode(null);
    };

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

    // Create / Edit
    const handleSubmit = async (formData: FormData) => {
        const isCreate = modalMode === "create";

        // Campos de texto
        const title = (formData.get("title") ?? "").toString();
        const slug = (formData.get("slug") ?? "").toString();
        const tag = (formData.get("tag") ?? "").toString();
        const location = (formData.get("location") ?? "").toString();
        const year = (formData.get("year") ?? "").toString();

        // Archivo de imagen (si lo hay)
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
    };

    const handleDelete = async (row: ProjectDTO) => {
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
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-1">
                <div>
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                        Projects
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md">
                        Gestioná los proyectos que se muestran en el portfolio.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="
                        self-start sm:self-auto
                        rounded-full bg-slate-900 px-4 py-2 my-2
                        text-xs sm:text-sm font-semibold text-white
                        shadow-sm hover:bg-slate-800
                    "
                >
                    + New Project
                </button>
            </div>

            <DataTable<ProjectDTO>
                columns={columns}
                data={pageItems}
                getRowId={(row) => row.id}
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={projects.length}
                onPageChange={setPage}
                renderRowActions={(row) => (
                    <>
                        <button
                            onClick={() => openEdit(row)}
                            className="font-semibold text-slate-900 hover:underline"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row)}
                            className="text-red-500 hover:underline"
                        >
                            Delete
                        </button>
                    </>
                )}
                emptyMessage="No projects yet."
            />

            <EntityModalForm<ProjectDTO>
                mode={modalMode ?? "create"}
                title="project"
                open={modalMode !== null}
                initialValues={selected ?? undefined}
                fields={fields}
                onClose={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
