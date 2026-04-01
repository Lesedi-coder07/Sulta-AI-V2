"use client";

import { PipelineNode, PipelineNodeKind, NODE_KIND_META } from "@/types/playground";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Copy } from "lucide-react";

interface NodeInspectorProps {
  node: PipelineNode | null;
  onUpdate: (id: string, data: Partial<PipelineNode["data"]>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function updateConfig(
  node: PipelineNode,
  key: string,
  value: unknown,
  onUpdate: NodeInspectorProps["onUpdate"]
) {
  onUpdate(node.id, { config: { ...node.data.config, [key]: value } });
}

function TypeSpecificFields({
  node,
  onUpdate,
}: {
  node: PipelineNode;
  onUpdate: NodeInspectorProps["onUpdate"];
}) {
  const kind = node.type as PipelineNodeKind;
  const config = node.data.config;

  switch (kind) {
    case "agent":
      return (
        <>
          <div className="space-y-1">
            <Label className="inspector-label">Model</Label>
            <select
              value={(config.model as string) ?? "claude-sonnet-4-6"}
              onChange={(e) => updateConfig(node, "model", e.target.value, onUpdate)}
              className="inspector-select"
            >
              <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
              <option value="claude-opus-4-6">Claude Opus 4.6</option>
              <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label className="inspector-label">Goal</Label>
            <Input
              value={(config.goal as string) ?? ""}
              onChange={(e) => updateConfig(node, "goal", e.target.value, onUpdate)}
              placeholder="What this agent should accomplish"
              className="inspector-input"
            />
          </div>
          <div className="space-y-1">
            <Label className="inspector-label">System prompt</Label>
            <Textarea
              value={(config.systemPrompt as string) ?? ""}
              onChange={(e) => updateConfig(node, "systemPrompt", e.target.value, onUpdate)}
              placeholder="You are a helpful assistant..."
              rows={5}
              className="inspector-input resize-none"
            />
          </div>
        </>
      );

    case "input":
      return (
        <div className="space-y-1">
          <Label className="inspector-label">Source</Label>
          <select
            value={(config.source as string) ?? "chat"}
            onChange={(e) => updateConfig(node, "source", e.target.value, onUpdate)}
            className="inspector-select"
          >
            <option value="chat">Chat</option>
            <option value="api">API</option>
            <option value="webhook">Webhook</option>
          </select>
        </div>
      );

    case "tool":
      return (
        <>
          <div className="space-y-1">
            <Label className="inspector-label">Tool</Label>
            <select
              value={(config.toolId as string) ?? ""}
              onChange={(e) => updateConfig(node, "toolId", e.target.value, onUpdate)}
              className="inspector-select"
            >
              <option value="" disabled>Select a tool...</option>
              <optgroup label="Search & Web">
                <option value="web-search">Web Search</option>
                <option value="web-scraper">Web Scraper</option>
              </optgroup>
              <optgroup label="Data & Files">
                <option value="file-reader">File Reader</option>
                <option value="code-interpreter">Code Interpreter</option>
                <option value="calculator">Calculator</option>
                <option value="database-query">Database Query</option>
              </optgroup>
              <optgroup label="Communication">
                <option value="send-email">Send Email</option>
                <option value="send-slack">Send Slack Message</option>
              </optgroup>
              <optgroup label="APIs">
                <option value="http-request">HTTP Request</option>
                <option value="webhook-call">Webhook Call</option>
              </optgroup>
            </select>
          </div>
          <div className="space-y-1">
            <Label className="inspector-label">Custom instructions</Label>
            <Textarea
              value={(config.instructions as string) ?? ""}
              onChange={(e) => updateConfig(node, "instructions", e.target.value, onUpdate)}
              placeholder="Any specific instructions for how this tool should be used..."
              rows={4}
              className="inspector-input resize-none"
            />
          </div>
        </>
      );

    case "response":
      return (
        <div className="space-y-1">
          <Label className="inspector-label">Format</Label>
          <select
            value={(config.format as string) ?? "text"}
            onChange={(e) => updateConfig(node, "format", e.target.value, onUpdate)}
            className="inspector-select"
          >
            <option value="text">Text</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="stream">Stream</option>
          </select>
        </div>
      );

    default:
      return null;
  }
}

export function NodeInspector({ node, onUpdate, onDelete, onDuplicate }: NodeInspectorProps) {
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <span className="text-white/20 text-lg">↖</span>
        </div>
        <p className="text-xs text-white/30 leading-relaxed">
          Click a node to inspect and edit its configuration
        </p>
      </div>
    );
  }

  const kind = node.type as PipelineNodeKind;
  const meta = NODE_KIND_META[kind];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2 border-b" style={{ borderColor: meta.borderColor }}>
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-[10px] font-semibold tracking-widest uppercase"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDuplicate(node.id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/8 transition-colors text-white/40 hover:text-white/70"
              title="Duplicate"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(node.id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/15 transition-colors text-white/40 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <div className="space-y-1">
          <Label className="inspector-label">Label</Label>
          <Input
            value={node.data.label}
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
            className="inspector-input"
          />
        </div>

        <div className="space-y-1">
          <Label className="inspector-label">Description</Label>
          <Input
            value={node.data.description ?? ""}
            onChange={(e) => onUpdate(node.id, { description: e.target.value })}
            placeholder="Optional note..."
            className="inspector-input"
          />
        </div>

        <div className="border-t border-white/5 pt-3">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 mb-3">
            Configuration
          </p>
          <div className="space-y-3">
            <TypeSpecificFields node={node} onUpdate={onUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}
