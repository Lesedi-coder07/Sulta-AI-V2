# Playground UI Build Plan

## Goal

Build a frontend-only visual editor on a new `playground` page where users can create agent logic pipelines by adding nodes, connecting them, and editing node configuration.

This phase is for the UI only. It should feel production-ready, but it does not need backend persistence or runtime execution yet.

## Product Intent

The editor should feel like a lightweight mix of n8n, Langflow, and a policy editor:

- Users can visually assemble an agent conversation pipeline.
- Each node represents a stage in the agent workflow.
- The canvas makes control flow explicit and debuggable.
- The right panel shows editable configuration for the selected node.
- The page should fit naturally inside the existing `(ai)` app shell.

## Existing App Context

This repo already has:

- Next.js 14 app router
- An `(ai)` app section using `SidebarProvider`, `AppSidebar`, and `SidebarTrigger`
- Existing dark UI patterns in `app/globals.css`
- Shared UI components under `components/ui`

There is currently no `playground` route, so this feature should be added fresh.

## Recommended Library

Use `@xyflow/react` as the graph editor library.

Why:

- Mature React node editor package
- Supports drag/drop, zoom, pan, minimap, controls, custom nodes, and connection handling
- Good fit for an n8n-like canvas without building graph primitives from scratch

## Route and Navigation

Create a new route:

- `app/(ai)/playground/page.tsx`

Update the app sidebar:

- Add a `Playground` entry in `components/Sidebar/app-sidebar.tsx`
- Route should be `/playground`

The page should reuse the same shell structure used by the other `(ai)` pages:

- `SidebarProvider`
- `AppSidebar`
- `SidebarTrigger`
- `main.app-shell`

## V1 Layout

Use a three-panel editor layout:

1. Left panel: node palette
2. Center panel: flow canvas
3. Right panel: node inspector

Add a compact top toolbar above the canvas area with:

- New graph
- Save draft
- Validate
- Auto-layout placeholder
- Run placeholder

The layout should feel intentional and dense, not like a generic admin dashboard.

## Visual Direction

Follow the current product theme, but give the playground its own personality:

- Keep the dark base from the app shell
- Use layered surfaces and subtle contrast shifts for the editor panels
- Add a slightly more technical canvas feel using faint grid lines, gradients, or soft radial background accents
- Use strong typography and compact labels
- Avoid a flat, default white-card-on-dark layout

The page should work on both desktop and mobile:

- Desktop: full editor experience
- Mobile: stacked layout or constrained fallback
- If the canvas is too cramped on mobile, it is acceptable to keep editing limited and prioritize safe rendering over full interaction

## V1 Node Types

Implement these initial node types:

- `input`
- `classifier`
- `planner`
- `tool`
- `guardrail`
- `memory`
- `response`
- `fallback`

Each node should have:

- Title
- Type badge
- Short summary of its configuration
- Connection handles
- Visual distinction by type

## Frontend Data Model

Create shared types for the editor graph.

Suggested files:

- `types/playground.ts`
- `lib/playground/validation.ts`
- `lib/playground/serialization.ts`

Suggested model shape:

```ts
export type PipelineNodeKind =
  | "input"
  | "classifier"
  | "planner"
  | "tool"
  | "guardrail"
  | "memory"
  | "response"
  | "fallback";

export type PipelineNodeData = {
  label: string;
  description?: string;
  config: Record<string, unknown>;
};

export type PipelineEdgeData = {
  label?: string;
  condition?: string;
};

export type PipelineGraph = {
  nodes: Array<{
    id: string;
    type: PipelineNodeKind;
    position: { x: number; y: number };
    data: PipelineNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    data?: PipelineEdgeData;
  }>;
};
```

Keep the model frontend-friendly and serializable.

## State Management

Use local React state for V1.

Recommended approach:

- A single `usePlaygroundState` hook owns `nodes`, `edges`, `selectedNodeId`, `validationIssues`, and draft persistence
- Canvas and inspector are controlled by that hook
- Use `localStorage` for draft save/load

Suggested local storage key:

- `playground:draft:v1`

## Component Breakdown

Create a dedicated playground component folder:

- `components/playground/playground-shell.tsx`
- `components/playground/playground-toolbar.tsx`
- `components/playground/node-palette.tsx`
- `components/playground/flow-canvas.tsx`
- `components/playground/node-inspector.tsx`
- `components/playground/validation-panel.tsx`
- `components/playground/nodes/agent-node-card.tsx`

Suggested responsibilities:

- `playground-shell.tsx`: overall layout and orchestration
- `playground-toolbar.tsx`: top actions and graph status
- `node-palette.tsx`: draggable node presets
- `flow-canvas.tsx`: React Flow wrapper and custom node registration
- `node-inspector.tsx`: selected node form
- `validation-panel.tsx`: visible issues list
- `agent-node-card.tsx`: reusable custom node UI

## Custom Node UX

Each node card should display:

- Node icon
- Node title
- Node type chip
- One or two key config values

Examples:

- `Input`: source is `chat` or `api`
- `Classifier`: routes by `intent`
- `Tool`: tool name or action
- `Guardrail`: active policy count
- `Response`: output mode or format

This should make the graph understandable at a glance without opening every node.

## Inspector Panel

When a node is selected, the right panel should show editable fields.

V1 inspector fields:

- `label`
- `description`
- `instruction` or `goal`
- type-specific config fields

Type-specific examples:

- `input`: source type
- `classifier`: classification target
- `planner`: allowed actions
- `tool`: tool identifier and description
- `guardrail`: policy list or rule text
- `memory`: memory mode
- `response`: response format
- `fallback`: fallback behavior

Forms can use existing `components/ui` inputs.

## Canvas Interactions

V1 interactions should include:

- Drag node from palette onto canvas
- Click node to select
- Connect nodes by dragging handles
- Delete selected node or edge
- Move nodes around freely
- Pan and zoom
- Fit view on initial load

Nice-to-have if simple:

- Duplicate node
- Edge labels
- Keyboard shortcuts

## Validation Rules

Add lightweight graph validation with visible feedback.

Minimum rules:

- Must contain exactly one `input` node
- Must contain at least one `response` or `fallback` endpoint
- No disconnected orphan nodes
- Edges cannot point to missing nodes
- Prevent self-loop connections unless explicitly allowed

Optional rule ideas:

- `tool` nodes should not be the first node
- `response` nodes should not have outgoing edges
- `classifier` should have at least two outgoing branches

Validation output should be human-readable and tie back to specific nodes when possible.

## Persistence

Frontend-only persistence is enough for V1.

Required behavior:

- On load, restore the latest local draft if present
- Save automatically after edits, or via explicit save button
- Allow reset to a clean starter graph

Optional:

- Export JSON
- Import JSON

## Suggested Starter Graph

Initialize the page with a simple default graph so the screen is not empty:

1. `Input`
2. `Planner`
3. `Response`

This makes the editor immediately understandable and reduces empty-state friction.

## Acceptance Criteria

The frontend V1 is complete when:

- `/playground` exists and is reachable from the sidebar
- The page renders inside the existing app shell
- Users can add, move, connect, select, and delete nodes
- Users can edit node properties in the inspector
- Draft graph state survives refresh using local storage
- Validation runs and shows clear issues
- The UI feels native to the product and not like a temporary scaffold

## Build Order

Implement in this order:

1. Add route and sidebar entry
2. Install and wire `@xyflow/react`
3. Build page shell and three-panel layout
4. Add graph state hook and starter graph
5. Implement custom node card UI
6. Add palette-driven node creation
7. Add inspector editing
8. Add validation panel
9. Add draft save/load
10. Polish layout, spacing, and empty states

## Out of Scope for This Phase

Do not build these yet unless they naturally fall out with little effort:

- Backend persistence
- Multi-user collaboration
- Runtime graph execution
- Agent tool calling engine
- Prompt compilation
- Server-side validation
- Version history

## Suggested Next Phase After UI

Once the UI is stable, the next implementation phase should be:

1. Graph serialization format
2. Runtime execution engine
3. Mapping nodes to agent state and tools
4. Save/load from backend
5. Test run panel with step-by-step inspection

## Handoff Notes

The builder agent should aim for a real product page, not a wireframe.

Important priorities:

- Clean graph editing experience
- Fast readability of node meaning
- Strong visual hierarchy
- Minimal but real validation
- Easy future extension into backend execution
