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
import { getAgents, updateAgentTools } from "@/app/(ai)/dashboard/actions";

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
  } = usePlaygroundState();

  // Agent selector state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentsLoading, setAgentsLoading] = useState(true);
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
            // silently ignore — agents list just stays empty
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

  // When an agent is selected, sync its configured tools into every tool node
  const handleSelectAgent = useCallback(
    (agent: Agent) => {
      setSelectedAgent(agent);
      const agentToolIds: string[] = Array.isArray(agent.tools) ? agent.tools : [];

      // Update all existing tool nodes to reflect this agent's tools
      setSelectedNodeId(null);
      // We propagate via updateNode for every tool node
      const toolNodes = nodes.filter((n) => n.type === "tool");
      for (const toolNode of toolNodes) {
        updateNode(toolNode.id, {
          config: { ...toolNode.data.config, toolIds: agentToolIds },
        });
      }
    },
    [nodes, updateNode, setSelectedNodeId]
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
    // Always save the local draft
    saveDraft({ nodes, edges });

    // If an agent is selected, persist its tool configuration to Firestore
    if (selectedAgent) {
      setSaveStatus("saving");
      const toolIds = collectToolIds();
      const result = await updateAgentTools(selectedAgent.id, toolIds);
      if (result.success) {
        // Update local agent state to reflect saved tools
        setSelectedAgent((prev) => prev ? { ...prev, tools: toolIds } : prev);
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
      {/* Toolbar */}
      <PlaygroundToolbar
        graph={{ nodes, edges }}
        validationIssues={validationIssues}
        onNewGraph={handleNewGraph}
        onSave={handleSave}
        onValidate={() => {}}
        saveStatus={saveStatus}
        agentSelector={
          <AgentSelector
            agents={agents}
            selectedAgent={selectedAgent}
            onSelect={handleSelectAgent}
            loading={agentsLoading}
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

        {/* Right: Inspector + Validation stacked */}
        <aside className="w-56 flex-shrink-0 border-l border-white/6 bg-[#0e0e0e]/80 flex flex-col overflow-hidden hidden md:flex">
          <div className="flex-1 overflow-hidden flex flex-col border-b border-white/5">
            <NodeInspector
              node={selectedNode}
              onUpdate={updateNode}
              onDelete={deleteNode}
              onDuplicate={duplicateNode}
            />
          </div>
          <div className="h-[180px] flex-shrink-0 overflow-hidden flex flex-col">
            <ValidationPanel issues={validationIssues} />
          </div>
        </aside>
      </div>
    </div>
  );
}
