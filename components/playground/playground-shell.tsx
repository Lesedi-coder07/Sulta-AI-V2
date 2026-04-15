"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { FlowCanvas } from "./flow-canvas";
import { NodePalette } from "./node-palette";
import { NodeInspector } from "./node-inspector";
import { ValidationPanel } from "./validation-panel";
import { PlaygroundToolbar } from "./playground-toolbar";
import { AgentSelector } from "./agent-selector";
import { PipelineNodeKind } from "@/types/playground";
import { saveDraft } from "@/lib/playground/serialization";
import { Agent } from "@/types/agent";
import {
  getAgents,
  getAgentGraph,
  saveAgentPlayground,
} from "@/app/(ai)/dashboard/actions";

export function PlaygroundShell() {
  const {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    setSelectedNodeId,
    validationIssues,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    duplicateNode,
    resetGraph,
    loadGraph,
  } = usePlaygroundState();

  // Agent selector state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load agents once Firebase auth is ready
  useEffect(() => {
    let unsub: (() => void) | undefined;
    import("@/app/api/firebase/firebaseConfig").then(({ auth }) => {
      unsub = auth.onAuthStateChanged(async (user: any) => {
        if (user?.uid) {
          try {
            const list = await getAgents(user.uid);
            setAgents(list);
          } catch {
            // silently ignore
          } finally {
            setAgentsLoading(false);
          }
        } else {
          setAgentsLoading(false);
        }
      });
    });
    return () => unsub?.();
  }, []);

  // When an agent is selected, load their saved graph from Firestore
  const handleSelectAgent = useCallback(
    async (agent: Agent) => {
      setSelectedAgent(agent);
      setSelectedNodeId(null);
      setGraphLoading(true);

      try {
        // Load the agent's saved graph (or fall back to an empty starter)
        const savedGraph = await getAgentGraph(agent.id);
        const graph = savedGraph ?? {
          nodes: [
            {
              id: "node-1",
              type: "input" as const,
              position: { x: 80, y: 200 },
              data: { label: "Input", config: { source: "chat" } },
            },
            {
              id: "node-2",
              type: "agent" as const,
              position: { x: 340, y: 200 },
              data: {
                label: agent.name,
                config: {
                  agentName: agent.name,
                  model: agent.llmConfig?.model ?? "gemini-3-flash-preview",
                  goal: "",
                  systemPrompt: "",
                },
              },
            },
            {
              id: "node-3",
              type: "tool" as const,
              position: { x: 600, y: 120 },
              data: {
                label: "Tools",
                config: { toolIds: Array.isArray(agent.tools) ? agent.tools : [] },
              },
            },
            {
              id: "node-4",
              type: "response" as const,
              position: { x: 600, y: 280 },
              data: { label: "Response", config: { format: "text" } },
            },
          ],
          edges: [
            { id: "e1-2", source: "node-1", target: "node-2" },
            { id: "e2-3", source: "node-2", target: "node-3" },
            { id: "e2-4", source: "node-2", target: "node-4" },
          ],
        };

        loadGraph(graph);

        // After loading, stamp the agent name + tools onto the relevant nodes.
        // We do this after loadGraph via a separate pass so the state is fresh.
        const agentToolIds: string[] = Array.isArray(agent.tools) ? agent.tools : [];

        // Update nodes that were just loaded
        for (const node of graph.nodes) {
          if (node.type === "agent") {
            updateNode(node.id, {
              label: agent.name,
              config: { ...node.data.config, agentName: agent.name },
            });
          }
          if (node.type === "tool") {
            updateNode(node.id, {
              config: { ...node.data.config, toolIds: agentToolIds },
            });
          }
        }
      } finally {
        setGraphLoading(false);
      }
    },
    [loadGraph, updateNode, setSelectedNodeId]
  );

  const handleAddNodeFromPalette = useCallback(
    (kind: PipelineNodeKind) => {
      const base = 200 + nodes.length * 30;
      addNode(kind, { x: base, y: base });
    },
    [addNode, nodes.length]
  );

  const handleAddNodeOnCanvas = useCallback(
    (kind: PipelineNodeKind, position: { x: number; y: number }) => {
      addNode(kind, position);
    },
    [addNode]
  );

  // Collect all enabled tool IDs across all tool nodes
  const collectToolIds = useCallback((): string[] => {
    const ids = new Set<string>();
    for (const node of nodes) {
      if (node.type === "tool") {
        const toolIds = node.data.config.toolIds;
        if (Array.isArray(toolIds)) {
          for (const id of toolIds as string[]) ids.add(id);
        }
      }
    }
    return Array.from(ids);
  }, [nodes]);

  const handleSave = useCallback(async () => {
    // Always persist the local draft
    saveDraft({ nodes, edges });

    // If an agent is selected, save the full graph + tools to Firestore
    if (selectedAgent) {
      setSaveStatus("saving");
      const toolIds = collectToolIds();
      const result = await saveAgentPlayground(selectedAgent.id, { nodes, edges }, toolIds);

      if (result.success) {
        setSelectedAgent((prev) => (prev ? { ...prev, tools: toolIds } : prev));
        setAgents((prev) =>
          prev.map((a) => (a.id === selectedAgent.id ? { ...a, tools: toolIds } : a))
        );
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }
  }, [nodes, edges, selectedAgent, collectToolIds]);

  const handleNewGraph = useCallback(() => {
    if (confirm("Reset the graph? Unsaved changes will be lost.")) {
      resetGraph();
      setSelectedAgent(null);
    }
  }, [resetGraph]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <PlaygroundToolbar
        graph={{ nodes, edges }}
        validationIssues={validationIssues}
        onNewGraph={handleNewGraph}
        onSave={handleSave}
        onValidate={() => {}}
        saveStatus={saveStatus}
        selectedAgentId={selectedAgent?.id ?? null}
        agentSelector={
          <AgentSelector
            agents={agents}
            selectedAgent={selectedAgent}
            onSelect={handleSelectAgent}
            loading={agentsLoading || graphLoading}
          />
        }
      />

      {/* Three-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Node palette */}
        <aside className="w-44 flex-shrink-0 border-r border-white/6 bg-[#0e0e0e]/80 overflow-hidden hidden md:flex flex-col">
          <NodePalette onAddNode={handleAddNodeFromPalette} />
        </aside>

        {/* Center: Flow canvas */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#0a0a0a" }}>
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(56,139,255,0.04) 0%, transparent 70%)",
            }}
          />

          {/* Graph loading overlay */}
          {graphLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111] border border-white/10 text-xs text-white/60">
                <svg className="w-3.5 h-3.5 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading agent pipeline…
              </div>
            </div>
          )}

          <div className="absolute inset-0 z-10">
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeSelect={setSelectedNodeId}
              onAddNode={handleAddNodeOnCanvas}
              selectedNodeId={selectedNodeId}
            />
          </div>
        </div>

        {/* Right: Inspector + Validation + Save footer */}
        <aside className="w-56 flex-shrink-0 border-l border-white/6 bg-[#0e0e0e]/80 flex flex-col overflow-hidden hidden md:flex">
          <div className="flex-1 overflow-hidden flex flex-col border-b border-white/5">
            <NodeInspector
              node={selectedNode}
              onUpdate={updateNode}
              onDelete={deleteNode}
              onDuplicate={duplicateNode}
            />
          </div>
          <div className="h-[180px] flex-shrink-0 overflow-hidden flex flex-col border-b border-white/5">
            <ValidationPanel issues={validationIssues} />
          </div>

          {/* Save footer — only shown when an agent is selected */}
          {selectedAgent && (
            <div className="flex-shrink-0 px-3 py-2.5 border-t border-white/6 bg-[#0e0e0e]">
              <p className="text-[10px] text-white/30 truncate mb-2">
                Editing{" "}
                <span className="text-violet-400 font-medium">{selectedAgent.name}</span>
              </p>
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  saveStatus === "saving"
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : saveStatus === "saved"
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : saveStatus === "error"
                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                    : "bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25"
                }`}
              >
                {saveStatus === "saving" && (
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {saveStatus === "saving"
                  ? "Saving…"
                  : saveStatus === "saved"
                  ? "Saved"
                  : saveStatus === "error"
                  ? "Save failed"
                  : "Save to agent"}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
