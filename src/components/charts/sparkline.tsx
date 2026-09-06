/**
 * A minimal trend line.
 *
 * Inline SVG rather than a charting library: this draws one polyline and needs
 * no axes, legend, tooltip or bundle. It uses `currentColor` so it inherits the
 * text colour and therefore themes for free — the app's palette is oklch, which
 * most chart libraries cannot parse anyway.
 *
 * Values are oldest-first.
 *
 * Pass `startLabel`/`endLabel` to anchor the line. Without them the shape is
 * normalised to fill the box, so a 2 kg drift and a 20 kg one look identical —
 * the labels are what turn the picture back into a measurement.
 */
export function Sparkline({
  values,
  width = 240,
  height = 48,
  className,
  ariaLabel,
  startLabel,
  endLabel,
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
  startLabel?: string;
  endLabel?: string;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  // A flat series would divide by zero; give it a nominal range so it renders
  // as a centred straight line rather than vanishing.
  const range = max - min || 1;

  const pad = 3;
  const stepX = (width - pad * 2) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const last = points[points.length - 1].split(',');

  const chart = (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={ariaLabel ?? `Trend of ${values.length} readings`}
      preserveAspectRatio="none"
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Marks where the series ends, which is the value that matters. */}
      <circle cx={last[0]} cy={last[1]} r={2.5} fill="currentColor" />
    </svg>
  );

  if (!startLabel && !endLabel) return chart;

  // Labels sit under the ends rather than inside the SVG: `preserveAspectRatio`
  // is "none", so anything drawn in there gets stretched with the line.
  return (
    <div className="space-y-1">
      {chart}
      <div className="flex items-baseline justify-between text-[11px] tabular-nums text-muted-foreground">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
}
