import { PipelineGraph } from "@/types/playground";

const DRAFT_KEY = "playground:draft:v2";

export function saveDraft(graph: PipelineGraph): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(graph));
  } catch {
    // storage not available
  }
}

export function loadDraft(): PipelineGraph | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PipelineGraph;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // storage not available
  }
}

export function exportJson(graph: PipelineGraph): void {
  const blob = new Blob([JSON.stringify(graph, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pipeline.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importJson(file: File): Promise<PipelineGraph> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const graph = JSON.parse(e.target?.result as string) as PipelineGraph;
        resolve(graph);
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
