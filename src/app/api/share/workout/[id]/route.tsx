import { ImageResponse } from 'next/og';
import { getUserId } from '@/lib/user';
import { getShareCardData, type ShareCardData } from '@/lib/share-card';
import { fitList, splitColumns, titleLines } from '@/lib/share-card-layout';

/**
 * Renders a workout as a shareable PNG.
 *
 *   ?layout=vertical  1080x1920, sized for a story overlay
 *   ?layout=compact   1080x1080, a square card for feeds and chat
 *   ?bg=transparent   alpha background, to sit over your own photo
 *   ?bg=solid         dark background, for anywhere a photo is not behind it
 *
 * Colours are hardcoded hex rather than the app's CSS variables because Satori
 * (which powers ImageResponse) does not understand `oklch`, and this app's
 * entire palette is oklch. Reusing the tokens would render black-on-black.
 *
 * Every performed exercise appears — the row typography shrinks, and splits
 * into two columns if it must, rather than truncating with "+N more".
 */

export const dynamic = 'force-dynamic';

const FG = '#fafafa';
const MUTED = '#a1a1aa';
const DIM = '#71717a';
const SOLID_BG = '#0a0a0a';
const RULE = 'rgba(250,250,250,0.16)';
/** Horizontal space between list columns. Must match the value fitList is told. */
const COLUMN_GAP = 48;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  // A route handler cannot redirect to a sign-in page usefully, so answer with
  // a status. 401 rather than a redirect keeps the client's fetch honest.
  if (!userId) return new Response('Not signed in', { status: 401 });

  const { id } = await params;
  const data = await getShareCardData(id, userId);

  // Also 404 when the workout belongs to someone else — see getShareCardData.
  if (!data) return new Response('Not found', { status: 404 });

  const url = new URL(request.url);
  const layout = url.searchParams.get('layout') === 'compact' ? 'compact' : 'vertical';
  const transparent = url.searchParams.get('bg') !== 'solid';

  const size =
    layout === 'compact'
      ? { width: 1080, height: 1080 }
      : { width: 1080, height: 1920 };

  return new ImageResponse(
    layout === 'compact' ? (
      <CompactCard data={data} transparent={transparent} />
    ) : (
      <VerticalCard data={data} transparent={transparent} />
    ),
    {
      ...size,
      headers: {
        // Private: this is one user's training data.
        'Cache-Control': 'private, no-store',
      },
    },
  );
}

/** Shared by both layouts so the wordmark and stat styling stay identical. */
function Stat({ value, label, big }: { value: string; label: string; big?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: big ? 72 : 56, color: FG, fontWeight: 600, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: big ? 24 : 20, color: DIM, letterSpacing: 2 }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
}

type Row = ShareCardData['exercises'][number];

/** One exercise line, sized by the fitted metrics. */
function ExerciseRow({ row, fontSize }: { row: Row; fontSize: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(fontSize * 0.4) }}>
      <span style={{ fontSize, color: FG, flex: 1 }}>{row.name}</span>
      {row.isPr ? (
        <span
          style={{
            fontSize: Math.round(fontSize * 0.62),
            color: SOLID_BG,
            background: FG,
            padding: `${Math.round(fontSize * 0.1)}px ${Math.round(fontSize * 0.36)}px`,
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          PR
        </span>
      ) : null}
      <span style={{ fontSize: Math.round(fontSize * 0.86), color: MUTED }}>
        {row.best ?? ''}
      </span>
    </div>
  );
}

function ExerciseList({
  rows,
  fontSize,
  gap,
  columns,
}: {
  rows: Row[];
  fontSize: number;
  gap: number;
  columns: number;
}) {
  const grouped = splitColumns(rows, columns);

  return (
    <div style={{ display: 'flex', gap: COLUMN_GAP }}>
      {grouped.map((column, index) => (
        <div
          key={index}
          style={{ display: 'flex', flexDirection: 'column', gap, flex: 1 }}
        >
          {column.map((row) => (
            <ExerciseRow key={row.name} row={row} fontSize={fontSize} />
          ))}
        </div>
      ))}
    </div>
  );
}

function VerticalCard({
  data,
  transparent,
}: {
  data: ShareCardData;
  transparent: boolean;
}) {
  const contentWidth = 1080 - 88 * 2;

  // Space the header takes, so the list knows what is left. Measured in the
  // same units the JSX below uses; keep the two in step when editing.
  const header =
    32 + // wordmark
    24 +
    titleLines(data.title, 84, contentWidth) * 88 + // title, 1-2 lines
    12 +
    36 + // date
    56 +
    100 + // stats block
    56 +
    2 +
    40; // rule and its margins

  const available = 1920 - 96 - 200 - header;

  const { fontSize, gap, columns } = fitList(
    data.exercises.map((e) => e.name),
    {
      available,
      idealFont: 34,
      minFont: 20,
      idealGap: 22,
      minGap: 8,
      width: contentWidth,
      columnGap: COLUMN_GAP,
    },
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: transparent ? 'transparent' : SOLID_BG,
        padding: '96px 88px 200px 88px',
        fontFamily: 'sans-serif',
        // A soft shadow keeps white text legible over a bright photo.
        textShadow: transparent ? '0 2px 24px rgba(0,0,0,0.55)' : 'none',
      }}
    >
      <span style={{ fontSize: 26, color: MUTED, letterSpacing: 6, flexShrink: 0 }}>
        WINTER ARC
      </span>

      <span style={{ fontSize: 84, color: FG, fontWeight: 700, lineHeight: 1.05, marginTop: 24, flexShrink: 0 }}>
        {data.title}
      </span>

      <span style={{ fontSize: 30, color: MUTED, marginTop: 12, flexShrink: 0 }}>
        {data.dateLabel}
        {data.durationLabel ? ` · ${data.durationLabel}` : ''}
      </span>

      <div style={{ display: 'flex', gap: 72, marginTop: 56, flexShrink: 0 }}>
        <Stat value={String(data.totalSets)} label="sets" big />
        {data.volume > 0 ? (
          <Stat value={formatVolume(data.volume)} label={`${data.unit} moved`} big />
        ) : null}
        {data.prCount > 0 ? (
          <Stat value={String(data.prCount)} label={data.prCount === 1 ? 'PR' : 'PRs'} big />
        ) : null}
      </div>

      <div style={{ display: 'flex', height: 2, background: RULE, marginTop: 56, marginBottom: 40 }} />

      <ExerciseList rows={data.exercises} fontSize={fontSize} gap={gap} columns={columns} />
    </div>
  );
}

function CompactCard({
  data,
  transparent,
}: {
  data: ShareCardData;
  transparent: boolean;
}) {
  const contentWidth = 1080 - 88 * 2;

  const header =
    30 + // wordmark
    20 +
    titleLines(data.title, 68, contentWidth) * 72 + // title
    10 +
    32 + // date
    40 +
    80 + // stats block
    40 +
    2 +
    32; // rule and its margins

  const available = 1080 - 88 * 2 - header;

  const { fontSize, gap, columns } = fitList(
    data.exercises.map((e) => e.name),
    {
      available,
      idealFont: 30,
      minFont: 18,
      idealGap: 16,
      minGap: 6,
      width: contentWidth,
      columnGap: COLUMN_GAP,
    },
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: transparent ? 'transparent' : SOLID_BG,
        padding: 88,
        fontFamily: 'sans-serif',
        textShadow: transparent ? '0 2px 24px rgba(0,0,0,0.55)' : 'none',
      }}
    >
      <span style={{ fontSize: 24, color: MUTED, letterSpacing: 6, flexShrink: 0 }}>
        WINTER ARC
      </span>

      <span style={{ fontSize: 68, color: FG, fontWeight: 700, lineHeight: 1.05, marginTop: 20, flexShrink: 0 }}>
        {data.title}
      </span>

      <span style={{ fontSize: 26, color: MUTED, marginTop: 10, flexShrink: 0 }}>
        {data.dateLabel}
        {data.durationLabel ? ` · ${data.durationLabel}` : ''}
      </span>

      <div style={{ display: 'flex', gap: 56, marginTop: 40, flexShrink: 0 }}>
        <Stat value={String(data.totalSets)} label="sets" />
        {data.volume > 0 ? (
          <Stat value={formatVolume(data.volume)} label={`${data.unit} moved`} />
        ) : null}
        {data.prCount > 0 ? (
          <Stat value={String(data.prCount)} label={data.prCount === 1 ? 'PR' : 'PRs'} />
        ) : null}
      </div>

      <div style={{ display: 'flex', height: 2, background: RULE, marginTop: 40, marginBottom: 32 }} />

      <ExerciseList rows={data.exercises} fontSize={fontSize} gap={gap} columns={columns} />
    </div>
  );
}

/** 12,500 -> "12.5k", so big numbers do not blow the layout. */
function formatVolume(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString('en-US');
}
