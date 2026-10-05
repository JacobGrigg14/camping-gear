export function Rating({ value }: { value: number }) {
  const pct = (value / 5) * 100;
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <span className="relative inline-block text-sm leading-none tracking-tight text-canvas-300" aria-hidden="true">
        ★★★★★
        <span className="absolute inset-0 overflow-hidden text-ember-500" style={{ width: `${pct}%` }}>
          ★★★★★
        </span>
      </span>
      <span className="text-sm font-semibold">{value.toFixed(1)}</span>
    </span>
  );
}
