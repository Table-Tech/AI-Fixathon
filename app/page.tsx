import { Button } from "@/components/ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">AI Fixathon</h1>
      <p className="text-foreground/60">Ready to build something awesome!</p>
      <div className="flex gap-2">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </main>
  );
}
