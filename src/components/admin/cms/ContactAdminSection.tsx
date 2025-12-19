"use client";

import React from "react";
import type { ContactSectionDTO } from "@/lib/cms/schemas";

export function ContactAdminSection() {
  const [contact, setContact] = React.useState<ContactSectionDTO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/contact");
        if (!res.ok) throw new Error("Failed to fetch contact section");
        const data = await res.json();
        setContact(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contact section");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contact) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update contact section");
      }

      const updated = await res.json();
      setContact(updated);
      setSuccessMessage("Contact section updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contact section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof ContactSectionDTO, value: string) => {
    if (!contact) return;
    setContact({ ...contact, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error || "Contact section not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Contact Section</h2>
        <p className="mt-1 text-sm text-slate-500">
          Edit the contact section header and contact information.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="eyebrow" className="block text-sm font-medium text-slate-700">
              Eyebrow Text
            </label>
            <input
              type="text"
              id="eyebrow"
              value={contact.eyebrow}
              onChange={(e) => handleChange("eyebrow", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Section Title
            </label>
            <input
              type="text"
              id="title"
              value={contact.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            value={contact.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
        </div>

        {/* Contact Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={contact.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={contact.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-slate-700">
              Availability Status
            </label>
            <input
              type="text"
              id="availability"
              value={contact.availability}
              onChange={(e) => handleChange("availability", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label htmlFor="calendlyUrl" className="block text-sm font-medium text-slate-700">
              Calendly URL (optional)
            </label>
            <input
              type="url"
              id="calendlyUrl"
              value={contact.calendlyUrl || ""}
              onChange={(e) => handleChange("calendlyUrl", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 border-t pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className={`rounded-lg px-6 py-2 text-sm font-semibold text-white ${
              isSaving
                ? "cursor-not-allowed bg-slate-400"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
