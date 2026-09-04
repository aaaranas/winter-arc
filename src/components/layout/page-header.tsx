import type { ReactNode } from 'react';

/**
 * Typography-led page heading: the hierarchy comes from size and weight, not
 * from colour or rules.
 *
 * On phones the actions drop onto their own row beneath the title. Sharing the
 * line with them left roughly 180px for the heading, which wrapped
 * "Push / Pull / Legs — Push" onto three lines and pushed the first exercise
 * card off screen. From sm up there is room for both on one line.
 */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 pt-2 pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 items-center gap-1 sm:pt-1">{action}</div>
      ) : null}
    </div>
  );
}
