import { PageSkeleton } from '@/components/layout/page-skeleton';

/** Streamed instantly while the Settings server render is in flight. */
export default function Loading() {
  return <PageSkeleton rows={3} />;
}
