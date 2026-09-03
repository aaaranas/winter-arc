import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/layout/page-header';
import { BodyMetricsForm } from '@/components/food/body-metrics-form';
import { ApplyPlanButton } from '@/components/food/apply-plan-button';
import { SourceBadge } from '@/components/food/source-badge';
import { db } from '@/lib/db';
import { currentUserId } from '@/lib/user';
import { getSettings } from '@/lib/queries';
import {
  computeMacroPlan,
  mealPatternLabel,
  splitIntoMeals,
  suggestMeal,
  type SuggestibleFood,
} from '@/lib/nutrition';
import { grams, kcal, num } from '@/lib/format';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Plan' };

export default async function PlanPage() {
  const [settings, foods] = await Promise.all([
    getSettings(),
    db.foodItem.findMany({
      where: { userId: currentUserId(), archived: false },
      orderBy: { name: 'asc' },
    }),
  ]);

  const plan = computeMacroPlan({
    weightKg: settings?.weightKg ?? null,
    heightCm: settings?.heightCm ?? null,
    age: settings?.age ?? null,
    sex: settings?.sex ?? null,
    activityLevel: settings?.activityLevel ?? 'moderate',
    goal: settings?.goal ?? 'maintain',
  });

  const pattern = settings?.mealPattern ?? 'THREE';
  const meals = plan ? splitIntoMeals(plan, pattern) : [];

  const suggestions = plan
    ? meals.map((meal, i) =>
        suggestMeal(meal, foods as SuggestibleFood[], i * 7 + 3),
      )
    : [];

  const targetsMatchPlan =
    plan !== null && settings?.calorieTarget === plan.targetCalories;

  return (
    <div>
      <PageHeader
        title="Plan"
        description="Your numbers, a macro target built from them, and what that looks like as meals."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About you</CardTitle>
          </CardHeader>
          <CardContent>
            <BodyMetricsForm
              defaults={{
                heightCm: settings?.heightCm ?? null,
                weightKg: settings?.weightKg ?? null,
                age: settings?.age ?? null,
                sex: settings?.sex ?? null,
                activityLevel: settings?.activityLevel ?? 'moderate',
                goal: settings?.goal ?? 'maintain',
                mealPattern: pattern,
              }}
            />
          </CardContent>
        </Card>

        {!plan ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Enter your height, weight and age above and a plan appears here.
              <br />
              No plan is shown from partial numbers — a guess dressed as a target
              is worse than nothing.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your daily target</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Figure label="Calories" value={kcal(plan.targetCalories)} unit="kcal" emphasis />
                  <Figure label="Protein" value={num(plan.protein, 0)} unit="g" />
                  <Figure label="Carbs" value={num(plan.carbs, 0)} unit="g" />
                  <Figure label="Fat" value={num(plan.fat, 0)} unit="g" />
                </div>

                <Separator />

                <dl className="grid gap-y-2 text-sm sm:grid-cols-2 sm:gap-x-12">
                  <Row term="BMR (Mifflin-St Jeor)" value={`${plan.bmr} kcal`} />
                  <Row term={`TDEE (${plan.activityLabel.toLowerCase()})`} value={`${plan.tdee} kcal`} />
                  <Row term="Goal" value={plan.goalLabel} />
                  <Row term="Meals" value={mealPatternLabel(pattern)} />
                </dl>

                <div className="flex flex-wrap items-center gap-3">
                  <ApplyPlanButton
                    targets={{
                      calories: plan.targetCalories,
                      protein: plan.protein,
                      carbs: plan.carbs,
                      fat: plan.fat,
                    }}
                    alreadyApplied={targetsMatchPlan}
                  />
                  {targetsMatchPlan ? (
                    <span className="text-xs text-muted-foreground">
                      Your food log is tracking against this plan.
                    </span>
                  ) : null}
                </div>

                <p className="border-t pt-3 text-xs text-muted-foreground">
                  This is an estimate. Mifflin-St Jeor predicts BMR within about
                  10% for most people, and activity multipliers are broad
                  buckets — so treat it as a starting point and adjust from what
                  the scale actually does over two or three weeks.
                  {plan.sexAssumed ? (
                    <>
                      {' '}
                      <strong className="text-foreground">
                        No sex was given, so a midpoint constant was used
                      </strong>{' '}
                      — the equation differs by about 166 kcal between the male
                      and female forms, so setting it will make this noticeably
                      more accurate.
                    </>
                  ) : null}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {mealPatternLabel(pattern)} · suggested meals
              </h2>

              {suggestions.map((suggestion) => (
                <Card key={suggestion.target.name}>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-medium">{suggestion.target.name}</h3>
                      <p className="text-xs tabular-nums text-muted-foreground">
                        target {kcal(suggestion.target.calories)} kcal ·{' '}
                        {suggestion.target.protein}g P · {suggestion.target.carbs}g C ·{' '}
                        {suggestion.target.fat}g F
                      </p>
                    </div>

                    {suggestion.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Not enough foods in your database to build a suggestion yet.
                      </p>
                    ) : (
                      <>
                        <ul className="space-y-1.5">
                          {suggestion.items.map(({ food, servings }) => (
                            <li
                              key={food.id}
                              className="flex items-center gap-3 text-sm"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="truncate">{food.name}</span>
                                  <SourceBadge
                                    sourceType={food.sourceType}
                                    isEstimate={food.isEstimate}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {num(servings, 2)} ×{' '}
                                  {food.servingLabel ??
                                    `${food.servingSize}${food.servingUnit}`}
                                </span>
                              </div>
                              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                {kcal(food.calories * servings)}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-xs tabular-nums">
                          <span className="text-muted-foreground">This combination</span>
                          <span>
                            {kcal(suggestion.totals.calories)} kcal ·{' '}
                            {grams(suggestion.totals.proteinG)} P ·{' '}
                            {grams(suggestion.totals.carbsG)} C ·{' '}
                            {grams(suggestion.totals.fatG)} F
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-normal">
                      How these are built
                    </Badge>
                  </div>
                  <p>
                    Each suggestion anchors on a protein-dense food from your own
                    database, adds a carb staple sized to the remaining target,
                    and adds a vegetable. It aims at the meal&rsquo;s protein and
                    calorie share rather than hitting every macro exactly — the
                    point is to show what the target looks like as food you
                    actually eat.
                  </p>
                  <p>
                    Items marked <em>Estimate</em> carry the same caveat they do
                    everywhere else: the macros behind them are rounded, not read
                    off a label.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Figure({
  label,
  value,
  unit,
  emphasis,
}: {
  label: string;
  value: string;
  unit: string;
  emphasis?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p
        className={
          emphasis
            ? 'text-2xl font-semibold tabular-nums'
            : 'text-2xl font-semibold tabular-nums text-foreground/90'
        }
      >
        {value}
        <span className="ml-0.5 text-sm font-normal text-muted-foreground">{unit}</span>
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed pb-1.5">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
