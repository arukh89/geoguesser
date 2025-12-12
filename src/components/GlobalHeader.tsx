"use client";

import { Button } from "@/components/ui/button";

export default function GlobalHeader() {
  return (
    <header className="relative z-20 bg-[var(--panel)] border-b mx-border shadow-[var(--shadow)]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        <Button size="md" onClick={() => location.assign("/")} aria-label="Home">Home</Button>
        <Button size="md" variant="secondary" onClick={() => history.back()} aria-label="Back">Back</Button>
        {/* Placeholder for Menu */}
      </div>
    </header>
  );
}
