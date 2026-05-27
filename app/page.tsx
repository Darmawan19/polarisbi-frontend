"use client";

import { Sidebar } from "@/components/cockpit/sidebar";
import { Header } from "@/components/cockpit/header";
import { EmptyState } from "@/components/cockpit/empty-state";

export default function Home() {
  const handleSubmit = (value: string) => {
    // TODO Chunk 4B-2: wire to FastAPI backend
    console.log("Submit:", value);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col overflow-hidden">
          <EmptyState onSubmit={handleSubmit} />
        </main>
      </div>
    </div>
  );
}
