import { Skeleton } from '@/components/ui/skeleton';

/**
 * Placeholder shown while a page's server render is in flight.
 *
 * Every data page is `force-dynamic`, so navigating always waits on a server
 * round trip. Without a loading state that wait is a dead tap — nothing on
 * screen changes for a few hundred milliseconds and the app feels broken
 * rather than busy. Next streams this instantly from the client, so the shell
 * and nav stay interactive while the content resolves.
 *
 * Shapes deliberately echo the real layout so the swap is not jarring.
 */
export function PageSkeleton({
  rows = 3,
  withStats = false,
}: {
  rows?: number;
  withStats?: boolean;
}) {
  return (
    <div className="animate-pulse">
      <div className="space-y-2 pt-2 pb-6">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>

      {withStats ? (
        <div className="mb-6 grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : null}

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
