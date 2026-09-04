import { ImageResponse } from 'next/og';
import { getUserId } from '@/lib/user';
import { getShareCardData, type ShareCardData } from '@/lib/share-card';

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
 */

export const dynamic = 'force-dynamic';

const FG = '#fafafa';
const MUTED = '#a1a1aa';
const DIM = '#71717a';
const SOLID_BG = '#0a0a0a';
const RULE = 'rgba(250,250,250,0.16)';

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

function VerticalCard({
  data,
  transparent,
}: {
  data: ShareCardData;
  transparent: boolean;
}) {
  // Only the first eight fit legibly at this size; the rest become a count.
  const shown = data.exercises.slice(0, 8);
  const remaining = data.exercises.length - shown.length;

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
      <span style={{ fontSize: 26, color: MUTED, letterSpacing: 6 }}>WINTER ARC</span>

      <span style={{ fontSize: 84, color: FG, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>
        {data.title}
      </span>

      <span style={{ fontSize: 30, color: MUTED, marginTop: 12 }}>
        {data.dateLabel}
        {data.durationLabel ? ` · ${data.durationLabel}` : ''}
      </span>

      <div style={{ display: 'flex', gap: 72, marginTop: 56 }}>
        <Stat value={String(data.totalSets)} label="sets" big />
        {data.volume > 0 ? (
          <Stat value={`${formatVolume(data.volume)}`} label={`${data.unit} moved`} big />
        ) : null}
        {data.prCount > 0 ? (
          <Stat value={String(data.prCount)} label={data.prCount === 1 ? 'PR' : 'PRs'} big />
        ) : null}
      </div>

      <div style={{ display: 'flex', height: 2, background: RULE, marginTop: 56, marginBottom: 40 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {shown.map((e) => (
          <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 34, color: FG, flex: 1 }}>{e.name}</span>
            {e.isPr ? (
              <span
                style={{
                  fontSize: 22,
                  color: SOLID_BG,
                  background: FG,
                  padding: '4px 14px',
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                PR
              </span>
            ) : null}
            <span style={{ fontSize: 30, color: MUTED }}>{e.best ?? ''}</span>
          </div>
        ))}
        {remaining > 0 ? (
          <span style={{ fontSize: 28, color: DIM }}>+{remaining} more</span>
        ) : null}
      </div>
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
  const shown = data.exercises.slice(0, 5);
  const remaining = data.exercises.length - shown.length;

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
      <span style={{ fontSize: 24, color: MUTED, letterSpacing: 6 }}>WINTER ARC</span>

      <span style={{ fontSize: 68, color: FG, fontWeight: 700, lineHeight: 1.05, marginTop: 20 }}>
        {data.title}
      </span>

      <span style={{ fontSize: 26, color: MUTED, marginTop: 10 }}>
        {data.dateLabel}
        {data.durationLabel ? ` · ${data.durationLabel}` : ''}
      </span>

      <div style={{ display: 'flex', gap: 56, marginTop: 40 }}>
        <Stat value={String(data.totalSets)} label="sets" />
        {data.volume > 0 ? (
          <Stat value={formatVolume(data.volume)} label={`${data.unit} moved`} />
        ) : null}
        {data.prCount > 0 ? (
          <Stat value={String(data.prCount)} label={data.prCount === 1 ? 'PR' : 'PRs'} />
        ) : null}
      </div>

      <div style={{ display: 'flex', height: 2, background: RULE, marginTop: 40, marginBottom: 32 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {shown.map((e) => (
          <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 30, color: FG, flex: 1 }}>{e.name}</span>
            {e.isPr ? (
              <span
                style={{
                  fontSize: 19,
                  color: SOLID_BG,
                  background: FG,
                  padding: '3px 12px',
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                PR
              </span>
            ) : null}
            <span style={{ fontSize: 26, color: MUTED }}>{e.best ?? ''}</span>
          </div>
        ))}
        {remaining > 0 ? (
          <span style={{ fontSize: 24, color: DIM }}>+{remaining} more</span>
        ) : null}
      </div>
    </div>
  );
}

/** 12,500 -> "12.5k", so big numbers do not blow the layout. */
function formatVolume(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString('en-US');
}
