const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface ReportFinding {
  question: string;
  sql: string | null;
}

export async function fetchReport(
  kind: string,
  fmt: string,
  findings?: ReportFinding[],
  title = "Insurance Data Briefing"
): Promise<{ blob: Blob; filename: string }> {
  const hasFindings = findings && findings.length > 0;
  const res = await fetch(
    `${API_URL}/api/report?kind=${kind}&fmt=${fmt}`,
    hasFindings
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, findings }),
        }
      : { method: "POST" }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition") ?? "";
  const filename =
    cd.match(/filename="?([^"]+)"?/)?.[1] ?? `PolarisBI-${kind}.${fmt}`;
  return { blob, filename };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
