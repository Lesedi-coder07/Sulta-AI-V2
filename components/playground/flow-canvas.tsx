"use client";

import { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeTypes,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { PipelineNode, PipelineEdge, PipelineNodeKind } from "@/types/playground";
import { AgentNodeCard } from "./nodes/agent-node-card";
import { EdgeChange, NodeChange, Connection } from "@xyflow/react";

const nodeTypes: NodeTypes = {
  agent: AgentNodeCard,
  input: AgentNodeCard,
  tool: AgentNodeCard,
  response: AgentNodeCard,
};

interface FlowCanvasInnerProps {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeSelect: (id: string | null) => void;
  onAddNode: (kind: PipelineNodeKind, position: { x: number; y: number }) => void;
  selectedNodeId: string | null;
}

function FlowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onAddNode,
  selectedNodeId,
}: FlowCanvasInnerProps) {
  const reactFlow = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const kind = e.dataTransfer.getData("application/x-node-kind") as PipelineNodeKind;
      if (!kind) return;

      const bounds = wrapperRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = reactFlow.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });
      onAddNode(kind, position);
    },
    [reactFlow, onAddNode]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          selected: n.id === selectedNodeId,
        }))}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_event, node) => onNodeSelect(node.id)}
        onPaneClick={() => onNodeSelect(null)}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode="Backspace"
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: {
            stroke: "rgba(255,255,255,0.15)",
            strokeWidth: 1.5,
          },
          animated: false,
        }}
        style={{ background: "transparent" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <Controls
          className="!bg-[#1a1a1a] !border !border-white/10 !rounded-lg overflow-hidden"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-[#111] !border !border-white/10 !rounded-lg overflow-hidden"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              agent: "rgba(139,92,246,0.8)",
              input: "rgba(56,139,255,0.7)",
              tool: "rgba(245,158,11,0.7)",
              response: "rgba(200,200,200,0.7)",
            };
            return colors[node.type ?? ""] ?? "#555";
          }}
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>
    </div>
  );
}

export function FlowCanvas(props: FlowCanvasInnerProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
