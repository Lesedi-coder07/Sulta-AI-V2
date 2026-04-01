"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";
import {
  PipelineEdge,
  PipelineGraph,
  PipelineNode,
  PipelineNodeKind,
  NODE_KIND_META,
  ValidationIssue,
} from "@/types/playground";
import { validateGraph } from "@/lib/playground/validation";
import { loadDraft, saveDraft } from "@/lib/playground/serialization";

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

const STARTER_GRAPH: PipelineGraph = {
  nodes: [
    {
      id: "node-1",
      type: "input",
      position: { x: 80, y: 200 },
      data: { label: "Input", config: { source: "chat" } },
    },
    {
      id: "node-2",
      type: "agent",
      position: { x: 340, y: 200 },
      data: {
        label: "Agent",
        config: {
          model: "claude-sonnet-4-6",
          goal: "",
          systemPrompt: "",
        },
      },
    },
    {
      id: "node-3",
      type: "response",
      position: { x: 600, y: 200 },
      data: { label: "Response", config: { format: "text" } },
    },
  ],
  edges: [
    { id: "e1-2", source: "node-1", target: "node-2" },
    { id: "e2-3", source: "node-2", target: "node-3" },
  ],
};

export function usePlaygroundState() {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [edges, setEdges] = useState<PipelineEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft or starter graph on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setNodes(draft.nodes);
      setEdges(draft.edges);
    } else {
      setNodes(STARTER_GRAPH.nodes);
      setEdges(STARTER_GRAPH.edges);
    }
  }, []);

  // Auto-save and validate after changes
  useEffect(() => {
    if (nodes.length === 0) return;
    const graph: PipelineGraph = { nodes, edges };
    setValidationIssues(validateGraph(graph));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(graph), 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as PipelineNode[]),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds) as PipelineEdge[]),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...connection, id: `e-${generateId()}` },
          eds
        ) as PipelineEdge[]
      ),
    []
  );

  const addNode = useCallback(
    (kind: PipelineNodeKind, position: { x: number; y: number }) => {
      const meta = NODE_KIND_META[kind];
      const newNode: PipelineNode = {
        id: `node-${generateId()}`,
        type: kind,
        position,
        data: {
          label: meta.label,
          description: meta.description,
          config: { ...meta.defaultConfig },
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(newNode.id);
    },
    []
  );

  const updateNode = useCallback(
    (id: string, data: Partial<PipelineNode["data"]>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...data } } : n
        )
      );
    },
    []
  );

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId((sel) => (sel === id ? null : sel));
  }, []);

  const duplicateNode = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return;
      const newNode: PipelineNode = {
        ...node,
        id: `node-${generateId()}`,
        position: { x: node.position.x + 40, y: node.position.y + 40 },
        data: { ...node.data, config: { ...node.data.config } },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(newNode.id);
    },
    [nodes]
  );

  const resetGraph = useCallback(() => {
    setNodes(STARTER_GRAPH.nodes);
    setEdges(STARTER_GRAPH.edges);
    setSelectedNodeId(null);
  }, []);

  const loadGraph = useCallback((graph: PipelineGraph) => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
    setSelectedNodeId(null);
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return {
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
  };
}
