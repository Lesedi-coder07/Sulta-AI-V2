export type PipelineNodeKind = "agent" | "input" | "tool" | "response";

export type PipelineNodeData = {
  label: string;
  description?: string;
  config: Record<string, unknown>;
};

export type PipelineEdgeData = {
  label?: string;
  condition?: string;
};

export type PipelineNode = {
  id: string;
  type: PipelineNodeKind;
  position: { x: number; y: number };
  data: PipelineNodeData;
};

export type PipelineEdge = {
  id: string;
  source: string;
  target: string;
  data?: PipelineEdgeData;
};

export type PipelineGraph = {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
};

export type ValidationIssue = {
  nodeId?: string;
  severity: "error" | "warning";
  message: string;
};

export const NODE_KIND_META: Record<
  PipelineNodeKind,
  {
    label: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    defaultConfig: Record<string, unknown>;
  }
> = {
  agent: {
    label: "Agent",
    description: "Core reasoning and orchestration",
    color: "hsl(258 60% 70%)",
    bgColor: "rgba(139, 92, 246, 0.10)",
    borderColor: "rgba(139, 92, 246, 0.30)",
    defaultConfig: { agentName: "", model: "gemini-3-flash-preview", systemPrompt: "", goal: "" },
  },
  input: {
    label: "Input",
    description: "Entry point for the pipeline",
    color: "hsl(210 100% 56%)",
    bgColor: "rgba(56, 139, 255, 0.08)",
    borderColor: "rgba(56, 139, 255, 0.25)",
    defaultConfig: { source: "chat" },
  },
  tool: {
    label: "Tool",
    description: "Executes a tool or action",
    color: "hsl(38 92% 50%)",
    bgColor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.25)",
    defaultConfig: { toolIds: [] as string[], instructions: "" },
  },
  response: {
    label: "Response",
    description: "Outputs the final response",
    color: "hsl(0 0% 85%)",
    bgColor: "rgba(255, 255, 255, 0.04)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    defaultConfig: { format: "text" },
  },
};
