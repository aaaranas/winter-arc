/**
 * Fits an exercise list into the space a share card has left over.
 *
 * The cards used to show the first 8 (story) or 5 (square) and append
 * "+N more", which hid most of a long session. Instead the row typography
 * shrinks until everything fits, and if a single column still cannot hold it,
 * the list splits into two.
 *
 * Everything here is arithmetic rather than measurement because Satori renders
 * server-side with no layout engine to query. The estimates deliberately err
 * toward "taller than it will really be": under-estimating pushed the list past
 * its box and made it overlap the header.
 */

export type ListMetrics = {
  fontSize: number;
  gap: number;
  /** 1 or 2. Two columns are a last resort for very long sessions. */
  columns: number;
};

type Bounds = {
  /** Height available for the list once the header and padding are removed. */
  available: number;
  /** Starting (largest) row font size. */
  idealFont: number;
  /** Never shrink past this — below it the card stops being readable. */
  minFont: number;
  idealGap: number;
  minGap: number;
  /** Full content width, before any column split. */
  width: number;
  /** Horizontal space between columns, matched to the JSX. */
  columnGap: number;
};

/** ~0.52em average glyph advance for this weight and family. */
const GLYPH = 0.52;

/**
 * How many lines a name wraps to inside its column.
 *
 * The name shares its row with a PR badge and the top set, so it gets roughly
 * 55% of the column. Narrow columns wrap far more than wide ones, which is
 * exactly what the single-line assumption got wrong.
 */
function linesFor(name: string, fontSize: number, columnWidth: number): number {
  const nameWidth = columnWidth * 0.55;
  const perLine = Math.max(1, Math.floor(nameWidth / (fontSize * GLYPH)));
  return Math.max(1, Math.ceil(name.length / perLine));
}

/** Total height of the tallest column, wrapping included. */
function columnHeight(
  names: string[],
  columns: number,
  fontSize: number,
  gap: number,
  bounds: Bounds,
): number {
  const columnWidth =
    (bounds.width - bounds.columnGap * (columns - 1)) / columns;
  const perColumn = Math.ceil(names.length / columns);

  let tallest = 0;
  for (let c = 0; c < columns; c += 1) {
    const slice = names.slice(c * perColumn, (c + 1) * perColumn);
    const height = slice.reduce(
      (sum, name) => sum + linesFor(name, fontSize, columnWidth) * fontSize * 1.25 + gap,
      0,
    );
    tallest = Math.max(tallest, height);
  }
  return tallest;
}

export function fitList(names: string[], bounds: Bounds): ListMetrics {
  if (names.length === 0) {
    return { fontSize: bounds.idealFont, gap: bounds.idealGap, columns: 1 };
  }

  const tryColumns = (columns: number) => {
    let fontSize = bounds.idealFont;
    let gap = bounds.idealGap;

    while (
      fontSize > bounds.minFont &&
      columnHeight(names, columns, fontSize, gap, bounds) > bounds.available
    ) {
      fontSize -= 1;
      // Tighten spacing alongside the type, but never past the floor.
      gap = Math.max(bounds.minGap, Math.round(gap * 0.92));
    }

    const fits =
      columnHeight(names, columns, fontSize, gap, bounds) <= bounds.available;
    return { fontSize, gap, fits };
  };

  const single = tryColumns(1);
  if (single.fits) return { fontSize: single.fontSize, gap: single.gap, columns: 1 };

  // Only worth splitting if each column still has room for a name.
  const columnWidth = (bounds.width - bounds.columnGap) / 2;
  if (columnWidth > 300) {
    const double = tryColumns(2);
    if (double.fits) {
      return { fontSize: double.fontSize, gap: double.gap, columns: 2 };
    }
    return { fontSize: bounds.minFont, gap: bounds.minGap, columns: 2 };
  }

  // Nothing else to give: render at the floor and accept a tight card.
  return { fontSize: bounds.minFont, gap: bounds.minGap, columns: 1 };
}

/**
 * Rough number of lines a title takes, so the space it steals from the list is
 * accounted for. Satori cannot be measured, so this errs toward more lines.
 */
export function titleLines(title: string, fontSize: number, width: number): number {
  const perLine = Math.max(1, Math.floor(width / (fontSize * GLYPH)));
  return Math.max(1, Math.ceil(title.length / perLine));
}

/** Splits a list into `columns` roughly equal chunks, filling column-first. */
export function splitColumns<T>(items: T[], columns: number): T[][] {
  if (columns <= 1) return [items];
  const perColumn = Math.ceil(items.length / columns);
  const out: T[][] = [];
  for (let i = 0; i < columns; i += 1) {
    out.push(items.slice(i * perColumn, (i + 1) * perColumn));
  }
  return out.filter((column) => column.length > 0);
}
