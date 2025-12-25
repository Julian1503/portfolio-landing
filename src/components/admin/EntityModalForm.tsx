// TypeScript
"use client";

import React from "react";
import Image from "next/image";

export type FieldConfig<T> = {
    name: keyof T;
    label: string;
    required?: boolean;
    inputProps?: {
        type?: string;
        as?: 'input' | 'textarea' | 'select';
        rows?: number;
        accept?: string;
        options?: { value: string; label: string }[];
        placeholder?: string;
        onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
        [key: string]: any;
    };
};

type EntityModalFormProps<T> = {
    mode: "create" | "edit";
    title: string;
    open: boolean;
    initialValues?: Partial<T>;
    fields: FieldConfig<T>[];
    onCloseAction: () => void;
    onSubmitAction: (formData: FormData) => Promise<void> | void;
    submitting?: boolean;
};

export function EntityModalForm<T>({
                                       mode,
                                       title,
                                       open,
                                       initialValues,
                                       fields,
                                       onCloseAction,
                                       onSubmitAction,
                                       submitting = false,
                                   }: EntityModalFormProps<T>) {
    const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        if (!open) {
            setFilePreviews((prev) => {
                Object.values(prev).forEach((url) => URL.revokeObjectURL(url));
                return {};
            });
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;
        const form = e.currentTarget;
        const data = new FormData(form);

        try {
            await onSubmitAction(data);
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
                        onClick={onCloseAction}
                        disabled={submitting}
                        className={`text-xs ${
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
                        const inputType = field.inputProps?.type || 'text';
                        const as = field.inputProps?.as || 'input';

                        const isFileInput = inputType === "file";
                        const isCheckbox = inputType === "checkbox";
                        const isTextarea = as === "textarea";
                        const isSelect = as === "select";

                        const existingValue = (initialValues as any)?.[field.name];

                        // Para checkbox, necesitamos el valor booleano
                        const checkboxChecked = isCheckbox ? Boolean(existingValue) : undefined;

                        // Para otros inputs (no file, no checkbox)
                        const initialValue = !isFileInput && !isCheckbox
                            ? (existingValue ?? "")
                            : undefined;

                        const previewUrl = filePreviews[key];

                        const { onChange: inputOnChange, ...restProps } = field.inputProps ?? {};

                        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

                            if (inputOnChange) inputOnChange(e as any);
                        };

                        // Estilos base compartidos
                        const baseInputStyles = `w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm
                            focus:outline-none focus:ring-2 focus:ring-slate-400/60
                            ${submitting ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}`;

                        return (
                            <div key={key} className="flex flex-col gap-1">
                                <label
                                    htmlFor={`field-${key}`}
                                    className="text-[11px] font-medium text-slate-600"
                                >
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {/* TEXTAREA */}
                                {isTextarea && (
                                    <textarea
                                        id={`field-${key}`}
                                        name={key}
                                        defaultValue={initialValue}
                                        required={field.required}
                                        disabled={submitting}
                                        rows={field.inputProps?.rows || 4}
                                        placeholder={field.inputProps?.placeholder}
                                        className={`${baseInputStyles} resize-none`}
                                    />
                                )}

                                {/* SELECT */}
                                {isSelect && (
                                    <select
                                        id={`field-${key}`}
                                        name={key}
                                        defaultValue={initialValue}
                                        required={field.required}
                                        disabled={submitting}
                                        className={baseInputStyles}
                                    >
                                        <option value="">-- Select --</option>
                                        {field.inputProps?.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {/* CHECKBOX */}
                                {isCheckbox && (
                                    <div className="flex items-center gap-2 py-1">
                                        <input
                                            id={`field-${key}`}
                                            name={key}
                                            type="checkbox"
                                            defaultChecked={checkboxChecked}
                                            disabled={submitting}
                                            className="w-4 h-4 rounded border-slate-300 text-slate-900
                                                focus:ring-2 focus:ring-slate-400/60 cursor-pointer
                                                disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <span className="text-xs text-slate-600">
                                            {field.inputProps?.placeholder || "Enable this option"}
                                        </span>
                                    </div>
                                )}

                                {/* FILE INPUT */}
                                {isFileInput && (
                                    <input
                                        id={`field-${key}`}
                                        name={key}
                                        type="file"
                                        required={field.required}
                                        disabled={submitting}
                                        accept={field.inputProps?.accept}
                                        onChange={handleFileChange}
                                        className={`${baseInputStyles} file:mr-3 file:py-1 file:px-3
                                            file:rounded-md file:border-0 file:text-xs file:font-semibold
                                            file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200`}
                                    />
                                )}

                                {/* REGULAR INPUT */}
                                {!isTextarea && !isSelect && !isCheckbox && !isFileInput && (
                                    <input
                                        id={`field-${key}`}
                                        name={key}
                                        type={inputType}
                                        defaultValue={initialValue}
                                        required={field.required}
                                        disabled={submitting}
                                        placeholder={field.inputProps?.placeholder}
                                        className={baseInputStyles}
                                        {...restProps}
                                    />
                                )}

                                {/* FILE PREVIEW */}
                                {isFileInput && (previewUrl || existingValue) && (
                                    <div className="mt-2">
                                        <p className="text-[11px] text-slate-500 mb-1">
                                            {previewUrl ? "New image preview:" : "Current image:"}
                                        </p>
                                        <div className="relative w-full max-h-48 h-48 rounded-md border overflow-hidden">
                                            <Image
                                                src={previewUrl ?? existingValue}
                                                alt="Preview"
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onCloseAction}
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
