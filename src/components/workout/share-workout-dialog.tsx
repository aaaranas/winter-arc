'use client';

import { useState, useSyncExternalStore } from 'react';
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Layout = 'vertical' | 'compact';
type Background = 'transparent' | 'solid';

/** Share capability never changes within a page, so there is nothing to watch. */
function subscribeNever() {
  return () => {};
}

/**
 * navigator.canShare only answers honestly when handed a real File, so probe
 * with an empty one. Returns a plain boolean, which keeps the snapshot stable
 * across renders.
 */
function detectCanShareFiles(): boolean {
  try {
    const probe = new File([new Blob()], 'probe.png', { type: 'image/png' });
    return Boolean(navigator.canShare?.({ files: [probe] }));
  } catch {
    return false;
  }
}

/**
 * Turns a workout into a shareable PNG.
 *
 * Vertical (1080x1920) is sized for a story; compact (1080x1080) suits feeds
 * and chat. Transparent backgrounds let the stats sit over your own photo the
 * way Strava's route cards do — which is only useful in an app that composites
 * them, so solid is offered for everywhere else.
 *
 * Sharing goes through the Web Share API with a file attached, which opens the
 * real system share sheet. Desktop browsers mostly cannot share files, so there
 * the button falls back to downloading the PNG.
 */
export function ShareWorkoutDialog({ workoutId }: { workoutId: string }) {
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<Layout>('vertical');
  const [background, setBackground] = useState<Background>('transparent');
  const [busy, setBusy] = useState(false);

  // Read a client-only capability without a hydration mismatch. useState +
  // useEffect would set state during the first commit and cascade a render;
  // useSyncExternalStore is the supported way to say "the server cannot know
  // this, assume false there".
  const canShareFiles = useSyncExternalStore(
    subscribeNever,
    detectCanShareFiles,
    () => false,
  );

  const imageUrl = `/api/share/workout/${workoutId}?layout=${layout}&bg=${background}`;

  async function buildFile(): Promise<File> {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Could not render the image (${response.status})`);
    const blob = await response.blob();
    return new File([blob], `winter-arc-${layout}.png`, { type: 'image/png' });
  }

  async function handleShare() {
    setBusy(true);
    try {
      const file = await buildFile();
      await navigator.share({ files: [file], title: 'Winter Arc' });
    } catch (error) {
      // Dismissing the share sheet rejects with AbortError; that is not a fault.
      if ((error as Error)?.name !== 'AbortError') {
        toast.error((error as Error).message || 'Could not share that image.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    setBusy(true);
    try {
      const file = await buildFile();
      const href = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = href;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(href);
    } catch (error) {
      toast.error((error as Error).message || 'Could not build that image.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share2 className="size-4" />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this workout</DialogTitle>
          <DialogDescription>
            A transparent PNG sits over your own photo in a story. Solid works
            anywhere else.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Segmented
            label="Shape"
            value={layout}
            onChange={(v) => setLayout(v as Layout)}
            options={[
              { value: 'vertical', label: 'Story', hint: '1080 × 1920' },
              { value: 'compact', label: 'Square', hint: '1080 × 1080' },
            ]}
          />

          <Segmented
            label="Background"
            value={background}
            onChange={(v) => setBackground(v as Background)}
            options={[
              { value: 'transparent', label: 'Transparent' },
              { value: 'solid', label: 'Solid' },
            ]}
          />

          {/* Checkerboard makes the alpha channel visible in the preview. */}
          <div
            className={cn(
              'flex items-center justify-center overflow-hidden rounded-lg border p-3',
              background === 'transparent' && 'bg-[repeating-conic-gradient(#3f3f46_0%_25%,#27272a_0%_50%)] bg-[length:20px_20px]',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={imageUrl}
              src={imageUrl}
              alt="Preview of the workout share image"
              className={cn(
                'h-auto w-full object-contain',
                layout === 'vertical' ? 'max-h-[45dvh]' : 'max-h-[35dvh]',
              )}
            />
          </div>

          <div className="flex gap-2">
            {canShareFiles ? (
              <Button onClick={handleShare} disabled={busy} className="flex-1">
                <Share2 className="size-4" />
                {busy ? 'Preparing…' : 'Share'}
              </Button>
            ) : null}
            <Button
              variant={canShareFiles ? 'outline' : 'default'}
              onClick={handleDownload}
              disabled={busy}
              className="flex-1"
            >
              <Download className="size-4" />
              {busy ? 'Preparing…' : 'Save image'}
            </Button>
          </div>

          {!canShareFiles ? (
            <p className="text-xs text-muted-foreground">
              This browser can&rsquo;t open the system share sheet, so the image
              downloads instead. Sharing directly works on Android Chrome and
              iOS Safari.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; hint?: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              'rounded-md border px-3 py-2 text-left text-sm transition-colors',
              value === option.value
                ? 'border-foreground/30 bg-accent'
                : 'text-muted-foreground hover:bg-accent/50',
            )}
          >
            <span className="block font-medium">{option.label}</span>
            {option.hint ? (
              <span className="block text-xs text-muted-foreground">{option.hint}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
