"use client";

import React from "react";

export type FieldConfig<T> = {
    name: keyof T;
    label: string;
    required?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

type EntityModalFormProps<T> = {
    mode: "create" | "edit";
    title: string;
    open: boolean;
    initialValues?: Partial<T>;
    fields: FieldConfig<T>[];
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void> | void;
    submitting?: boolean; // 👈 nuevo
};

export function EntityModalForm<T>({
                                       mode,
                                       title,
                                       open,
                                       initialValues,
                                       fields,
                                       onClose,
                                       onSubmit,
                                       submitting = false,
                                   }: EntityModalFormProps<T>) {
    const [filePreviews, setFilePreviews] = React.useState<
        Record<string, string>
    >({});

    React.useEffect(() => {
        if (!open) {
            Object.values(filePreviews).forEach((url) => URL.revokeObjectURL(url));
            setFilePreviews({});
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;
        const form = e.currentTarget;
        const data = new FormData(form);

        try {
            await onSubmit(data);
        } catch (error) {
            console.error("Failed to submit form:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/35 backdrop-blur-sm px-3 py-6">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                    <h2 className="text-sm font-semibold text-slate-900">
                        {mode === "create" ? `Create ${title}` : `Edit ${title}`}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className={`text-xs  ${
                            submitting
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3 text-sm">
                    {fields.map((field) => {
                        const key = String(field.name);
                        const isFileInput = field.inputProps?.type === "file";

                        const existingValue = (initialValues as any)?.[field.name] as
                            | string
                            | undefined;

                        const initialValue = !isFileInput
                            ? existingValue ?? ""
                            : undefined;

                        const previewUrl = filePreviews[key];

                        const { onChange: inputOnChange, ...restProps } =
                        field.inputProps ?? {};

                        const handleFileChange = (
                            e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            const file = e.target.files?.[0];

                            setFilePreviews((prev) => {
                                if (prev[key]) URL.revokeObjectURL(prev[key]);
                                return prev;
                            });

                            if (file) {
                                const url = URL.createObjectURL(file);
                                setFilePreviews((prev) => ({ ...prev, [key]: url }));
                            } else {
                                setFilePreviews((prev) => {
                                    const copy = { ...prev };
                                    delete copy[key];
                                    return copy;
                                });
                            }

                            if (inputOnChange) inputOnChange(e);
                        };

                        return (
                            <div key={key} className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-slate-600">
                                    {field.label}
                                </label>

                                <input
                                    name={key}
                                    {...(!isFileInput && { defaultValue: initialValue })}
                                    required={field.required}
                                    disabled={submitting}
                                    className={`rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/60 ${
                                        submitting
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : ""
                                    }`}
                                    {...restProps}
                                    onChange={
                                        isFileInput ? handleFileChange : (inputOnChange as any)
                                    }
                                />

                                {isFileInput && (previewUrl || existingValue) && (
                                    <div className="mt-2">
                                        <p className="text-[11px] text-slate-500 mb-1">
                                            {previewUrl ? "New image preview:" : "Current image:"}
                                        </p>
                                        <img
                                            src={previewUrl ?? existingValue}
                                            alt="Preview"
                                            className="w-full max-h-48 object-cover rounded-md border"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className={`text-xs ${
                                submitting
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-slate-500 hover:underline"
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm ${
                                submitting
                                    ? "bg-slate-200 text-slate-400 cursor-wait"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                        >
                            {submitting ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
