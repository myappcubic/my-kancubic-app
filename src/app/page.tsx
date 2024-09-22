"use client";

import { useState } from "react";
import Layout from "@/components/layout";
import LandingPage from "@/components/landing-page";
import KanbanBoard from "@/components/kanban-board";

export default function Home() {
  const [showKanban, setShowKanban] = useState(false);

  return (
    <Layout>
      {showKanban ? (
        <KanbanBoard />
      ) : (
        <LandingPage onStart={() => setShowKanban(true)} />
      )}
    </Layout>
  );
}
