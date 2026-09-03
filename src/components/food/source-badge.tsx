import { Badge } from '@/components/ui/badge';
import { sourceLabel } from '@/lib/format';

/**
 * Shows where a food's numbers came from. This is the visible half of the seed
 * dataset's honesty contract: an estimate must never look like a label reading.
 */
export function SourceBadge({
  sourceType,
  isEstimate,
}: {
  sourceType: string;
  isEstimate: boolean;
}) {
  const solid = sourceType === 'OFFICIAL' || sourceType === 'LABEL';

  return (
    <Badge
      variant={solid ? 'secondary' : 'outline'}
      className="h-5 px-1.5 text-[10px] font-normal"
      title={
        isEstimate
          ? 'Rounded estimate — not from a published nutrition panel.'
          : 'From a published source.'
      }
    >
      {sourceLabel(sourceType)}
    </Badge>
  );
}
