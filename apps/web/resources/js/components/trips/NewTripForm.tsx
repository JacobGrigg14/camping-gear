import { router } from "@inertiajs/react";
import { useState } from "react";
import { api } from "@/lib/api";
import { inputClass, primaryButtonClass } from "../auth/ui";

type TemplateSummary = { id: string; name: string; description: string };

export function NewTripForm({ templates }: { templates: TemplateSummary[] }) {
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const choices = [
    ...templates,
    { id: "", name: "Start from scratch", description: "An empty checklist to fill yourself." },
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const tripName = name.trim() || choices.find((c) => c.id === templateId)?.name || "My trip";
    setBusy(true);
    setError("");
    try {
      const trip = await api.createTrip(tripName, templateId || undefined);
      router.visit(`/trips/${trip.id}`);
    } catch {
      setError("Couldn't create the trip. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-5">
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Checklist template</legend>
        {choices.map((c) => (
          <label
            key={c.id || "blank"}
            className={`cursor-pointer rounded-lg border-2 bg-white p-4 transition ${
              templateId === c.id ? "border-forest-700" : "border-canvas-200 hover:border-canvas-300"
            }`}
          >
            <input
              type="radio"
              name="template"
              value={c.id}
              checked={templateId === c.id}
              onChange={() => setTemplateId(c.id)}
              className="sr-only"
            />
            <span className="block font-display text-lg font-bold">{c.name}</span>
            <span className="text-sm text-bark-700">{c.description}</span>
          </label>
        ))}
      </fieldset>
      <label className="block max-w-md">
        <span className="mb-1 block text-sm font-semibold text-bark-700">Trip name (optional)</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Algonquin long weekend"
          maxLength={80}
          className={inputClass}
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className={`${primaryButtonClass} max-w-md`}>
        {busy ? "Creating…" : "Create checklist"}
      </button>
    </form>
  );
}
