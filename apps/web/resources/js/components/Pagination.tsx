const buttonClass = "min-w-10 rounded-md px-3 py-2 text-sm font-semibold transition";

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${buttonClass} border border-canvas-300 bg-white hover:bg-canvas-100 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        ← Prev
      </button>
      {pages.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={`Page ${n}`}
          className={`${buttonClass} ${
            n === page ? "bg-forest-700 text-white" : "border border-canvas-300 bg-white hover:bg-canvas-100"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        className={`${buttonClass} border border-canvas-300 bg-white hover:bg-canvas-100 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next →
      </button>
    </nav>
  );
}
