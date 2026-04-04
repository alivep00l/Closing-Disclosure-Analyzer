"use client";
import { useCDStore } from "@/store/cdStore";
import UploadZone from "@/components/UploadZone";
import Dashboard from "@/components/Dashboard";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function Home() {
  const { appState, parseProgress } = useCDStore();

  return (
    <>
      {appState === "parsing" && <LoadingOverlay message={parseProgress || "Processing your document…"} />}
      {appState === "upload" || appState === "parsing" ? <UploadZone /> : null}
      {appState === "dashboard" && <Dashboard />}
    </>
  );
}
