import { PageSkeleton } from '@/components/layout/page-skeleton';

/** Streamed instantly while the History server render is in flight. */
export default function Loading() {
  return <PageSkeleton rows={5} />;
}
