export interface Agent {
    id: string;
    name: string;
    type: string;
    status: string;
    isPublic: boolean;
    description?: string;
    personality?: string;
    tone?: string;
    expertise?: string | string[]; // Supports legacy array and current text input
    contextMemory?: number;
    // Additional properties from Firebase
    userId?: string;
    ownerID?: string;
    createdAt?: string;
    systemMessage?: string;
    totalQueries?: number;
    tokensUsed?: number;
    totalChats?: number;
    // New fields
    extendedThinking?: boolean;
    guardrails?: string;
    llmConfig?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    };
    customApiTool?: {
      url?: string;
      responseSchema?: string;
      parameters?: string;
    };
    customSystemPrompt?: string;
    extraContext?: string;
  }
