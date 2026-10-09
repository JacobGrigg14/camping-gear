export const inputClass =
  "w-full rounded-md border border-canvas-300 bg-white px-3 py-2 focus:border-forest-500 focus:outline-none";

export const primaryButtonClass =
  "w-full rounded-md bg-ember-500 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-ember-600 disabled:opacity-60";

export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-lg border border-canvas-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-bark-700">{label}</span>
      <input className={inputClass} aria-invalid={error ? true : undefined} {...props} />
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}

export function Alert({ kind = "error", children }: { kind?: "error" | "info"; children: React.ReactNode }) {
  const styles =
    kind === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-forest-100 bg-forest-50 text-forest-800";
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`rounded-md border px-3 py-2 text-sm ${styles}`}>
      {children}
    </p>
  );
}
