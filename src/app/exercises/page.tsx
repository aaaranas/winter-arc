import { PageHeader } from '@/components/layout/page-header';
import { ExerciseBrowser } from '@/components/workout/exercise-browser';
import { getAllExercises } from '@/lib/exercises';

export const metadata = { title: 'Exercises' };

export default function ExercisesPage() {
  const total = getAllExercises().length;

  return (
    // A bounded height, not a minimum: the picker's ScrollArea can only scroll
    // if an ancestor actually constrains it. With min-h the flex child grows to
    // fit all 302 cards and the page itself becomes 26,000px tall.
    //
    // The subtraction differs per breakpoint because the chrome does: phones
    // have a header plus the bottom nav bar, desktop has neither (the sidebar
    // is beside the content, not above it).
    <div className="flex h-[calc(100dvh-11rem)] flex-col lg:h-[calc(100dvh-6rem)]">
      <PageHeader
        title="Exercises"
        description={`${total} exercises. Tap any one for how-to steps and its illustration frames.`}
      />
      <ExerciseBrowser />
    </div>
  );
}
