"use client";

import { useCallback } from "react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { FlowCanvas } from "./flow-canvas";
import { NodePalette } from "./node-palette";
import { NodeInspector } from "./node-inspector";
import { ValidationPanel } from "./validation-panel";
import { PlaygroundToolbar } from "./playground-toolbar";
import { PipelineNodeKind } from "@/types/playground";
import { saveDraft } from "@/lib/playground/serialization";

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

  const handleAddNodeFromPalette = useCallback(
    (kind: PipelineNodeKind) => {
      // Place new nodes in a visible area offset from center
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

  const handleSave = useCallback(() => {
    saveDraft({ nodes, edges });
  }, [nodes, edges]);

  const handleNewGraph = useCallback(() => {
    if (confirm("Reset the graph? Unsaved changes will be lost.")) {
      resetGraph();
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
        onValidate={() => {}} // validation is always live
      />

      {/* Three-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Node palette */}
        <aside className="w-44 flex-shrink-0 border-r border-white/6 bg-[#0e0e0e]/80 overflow-hidden hidden md:flex flex-col">
          <NodePalette onAddNode={handleAddNodeFromPalette} />
        </aside>

        {/* Center: Flow canvas */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#0a0a0a" }}>
          {/* Subtle radial background accent */}
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
