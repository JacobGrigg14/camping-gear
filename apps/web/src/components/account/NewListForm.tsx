"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputClass } from "../auth/ui";
import { useAccount } from "../AccountProvider";

export function NewListForm() {
  const router = useRouter();
  const { newList } = useAccount();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setError("");
    try {
      const id = await newList(trimmed);
      if (id) router.push(`/my-gear/${id}`);
    } catch {
      setError("Couldn't create the list. Try again.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="List name"
        maxLength={80}
        aria-label="List name"
        className={inputClass}
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="shrink-0 rounded-md bg-forest-700 px-4 font-semibold text-white hover:bg-forest-800 disabled:opacity-50"
      >
        Create
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
