import { PipelineGraph, ValidationIssue } from "@/types/playground";

export function validateGraph(graph: PipelineGraph): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { nodes, edges } = graph;
  const nodeIds = new Set(nodes.map((n) => n.id));

  // Must have exactly one input node
  const inputNodes = nodes.filter((n) => n.type === "input");
  if (inputNodes.length === 0) {
    issues.push({ severity: "error", message: "Pipeline must have an Input node." });
  } else if (inputNodes.length > 1) {
    issues.push({ severity: "error", message: "Pipeline can only have one Input node." });
  }

  // Must have at least one agent node
  const agentNodes = nodes.filter((n) => n.type === "agent");
  if (agentNodes.length === 0) {
    issues.push({ severity: "error", message: "Pipeline must have at least one Agent node." });
  }

  // Must have at least one response endpoint
  const responseNodes = nodes.filter((n) => n.type === "response");
  if (responseNodes.length === 0) {
    issues.push({ severity: "error", message: "Pipeline must have at least one Response node." });
  }

  // No disconnected orphan nodes
  if (nodes.length > 1) {
    const connectedNodeIds = new Set<string>();
    for (const edge of edges) {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    }
    for (const node of nodes) {
      if (!connectedNodeIds.has(node.id)) {
        issues.push({
          nodeId: node.id,
          severity: "warning",
          message: `Node "${node.data.label}" is disconnected.`,
        });
      }
    }
  }

  // Edges cannot point to missing nodes
  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      issues.push({ severity: "error", message: `Edge references missing source node "${edge.source}".` });
    }
    if (!nodeIds.has(edge.target)) {
      issues.push({ severity: "error", message: `Edge references missing target node "${edge.target}".` });
    }
  }

  // Self-loop prevention
  for (const edge of edges) {
    if (edge.source === edge.target) {
      const label = nodes.find((n) => n.id === edge.source)?.data.label ?? edge.source;
      issues.push({ nodeId: edge.source, severity: "error", message: `Node "${label}" has a self-loop.` });
    }
  }

  // Response nodes should not have outgoing edges
  for (const rn of responseNodes) {
    if (edges.some((e) => e.source === rn.id)) {
      issues.push({
        nodeId: rn.id,
        severity: "warning",
        message: `Response node "${rn.data.label}" should not have outgoing connections.`,
      });
    }
  }

  return issues;
}
