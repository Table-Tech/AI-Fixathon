"use client";

interface ExampleFeatureProps {
  title: string;
}

export function ExampleFeature({ title }: ExampleFeatureProps) {
  return (
    <section className="rounded-lg border border-foreground/10 p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-foreground/60">Replace this with your feature component.</p>
    </section>
  );
}
