import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/layout/page-header';
import { updateSettings } from '@/lib/actions/settings';
import { getSettings } from '@/lib/queries';
import { getAttributionSummary } from '@/lib/exercises';
import { db } from '@/lib/db';
import { requireUserId } from '@/lib/user';
import { visibleFoods } from '@/lib/food-scope';
import Link from 'next/link';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const [settings, provenance] = await Promise.all([
    getSettings(),
    db.foodItem.groupBy({
      by: ['sourceType'],
      where: visibleFoods(await requireUserId()),
      _count: true,
    }),
  ]);

  const attribution = getAttributionSummary();
  const totalFoods = provenance.reduce((n, p) => n + p._count, 0);

  return (
    <div>
      <PageHeader title="Settings" description="Targets, data and credits." />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily targets</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateSettings} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  id="calorieTarget"
                  label="Calories"
                  defaultValue={settings?.calorieTarget}
                />
                <Field
                  id="proteinTarget"
                  label="Protein (g)"
                  defaultValue={settings?.proteinTarget}
                />
                <Field
                  id="carbsTarget"
                  label="Carbs (g)"
                  defaultValue={settings?.carbsTarget}
                />
                <Field
                  id="fatTarget"
                  label="Fat (g)"
                  defaultValue={settings?.fatTarget}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="weightUnit">Default weight unit</Label>
                  <Input
                    id="weightUnit"
                    name="weightUnit"
                    defaultValue={settings?.weightUnit ?? 'kg'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restTimerSec">Rest timer (seconds)</Label>
                  <Input
                    id="restTimerSec"
                    name="restTimerSec"
                    inputMode="numeric"
                    defaultValue={settings?.restTimerSec ?? 120}
                    className="tabular-nums"
                  />
                  <p className="text-xs text-muted-foreground">
                    Starts automatically after each set. 0 turns it off.
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Leave a target empty to hide its progress bar.
              </p>

              <Button type="submit">Save</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Where the food data comes from</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              {totalFoods} foods in your database. Every one carries a
              provenance label so a rounded guess never passes for a published
              figure.
            </p>

            <dl className="space-y-2">
              {provenance
                .sort((a, b) => b._count - a._count)
                .map((p) => (
                  <div
                    key={p.sourceType}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="font-medium">{PROVENANCE[p.sourceType]?.title ?? p.sourceType}</dt>
                    <dd className="text-xs tabular-nums text-muted-foreground">
                      {p._count}
                    </dd>
                  </div>
                ))}
            </dl>

            <Separator />

            <ul className="space-y-2 text-xs text-muted-foreground">
              {Object.entries(PROVENANCE).map(([key, v]) => (
                <li key={key}>
                  <span className="font-medium text-foreground">{v.title}</span>{' '}
                  — {v.description}
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground">
              Jollibee figures come from the chain&rsquo;s own published nutrition
              document for its <strong>USA</strong> menu; Philippine portions may
              differ. Chowking, Mang Inasal and Greenwich publish no retrievable
              nutrition data, so their items are estimates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exercise illustrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              {attribution.totalExercises} exercises and{' '}
              {attribution.totalFrames} illustration frames from{' '}
              <ExternalLink href={attribution.packageHomepage}>
                Workout Guide
              </ExternalLink>
              , created by{' '}
              <ExternalLink href={attribution.creatorUrl}>
                {attribution.creator}
              </ExternalLink>
              .
            </p>

            <p>
              Artwork is licensed under{' '}
              <ExternalLink href={attribution.assetLicenseUrl}>
                {attribution.assetLicense}
              </ExternalLink>
              . The package&rsquo;s source code is {attribution.codeLicense}{' '}
              licensed.
            </p>

            <p>
              {attribution.everkineticDerivedCount} of the first-pose frames are
              rasterized adaptations of artwork from{' '}
              <ExternalLink href={attribution.upstreamUrl}>
                {attribution.upstream}
              </ExternalLink>
              , also under {attribution.assetLicense}. The source artwork was
              placed on a transparent 512 × 512 canvas, recolored for monochrome
              display, and exported as optimized PNG.
            </p>

            <p className="text-xs">
              CC BY-SA 4.0 requires that adaptations of this artwork are shared
              under the same license.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exercise instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The how-to steps shown on each exercise are standard form cues
              written for this app. The exercise package ships illustrations and
              metadata but <strong className="text-foreground">no instruction
              text</strong>, so there is no official source being quoted here.
            </p>
            <p>They are not coaching or medical advice. If a movement hurts, stop.</p>
          </CardContent>
        </Card>

        <p className="pb-4 text-center text-xs text-muted-foreground">
          <Link href="/exercises" className="underline underline-offset-4">
            Browse all exercises
          </Link>
        </p>
      </div>
    </div>
  );
}

const PROVENANCE: Record<string, { title: string; description: string }> = {
  OFFICIAL: {
    title: 'Official',
    description:
      "transcribed from the publisher's own nutrition document.",
  },
  LABEL: {
    title: 'Label',
    description: 'read off a product nutrition facts panel.',
  },
  REFERENCE: {
    title: 'Reference',
    description:
      'typical composition for a generic food, from food-composition tables.',
  },
  ESTIMATE: {
    title: 'Estimate',
    description:
      'inherently variable — home cooking, or a chain that publishes nothing. Rounded on purpose.',
  },
  USER: {
    title: 'Yours',
    description: 'entered or corrected by you.',
  },
};

function Field({
  id,
  label,
  defaultValue,
}: {
  id: string;
  label: string;
  defaultValue?: number | null;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        defaultValue={defaultValue ?? ''}
        inputMode="decimal"
        placeholder="—"
        className="tabular-nums"
      />
    </div>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-foreground underline underline-offset-4"
    >
      {children}
    </a>
  );
}
