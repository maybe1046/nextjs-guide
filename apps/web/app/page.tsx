import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

/**
 * Home route — a Server Component by default.
 * `<Button>` carries the `"use client"` boundary; `<Card>` stays on the server.
 */
export default function Page() {
  return (
    <main className="page">
      <h1>Turborepo Starter</h1>
      <p>
        A React / Next.js / Turborepo monorepo scaffold. See{" "}
        <code>docs/best-practices.html</code> and <code>CONTRIBUTING.md</code>.
      </p>
      <Card title="Shared UI">
        <p>This card is rendered on the server and ships no JavaScript.</p>
        <Button variant="primary">Interactive button</Button>
      </Card>
    </main>
  );
}
