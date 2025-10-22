export interface Agent {
    id: string;
    name: string;
    type: string;
    status: string;
    isPublic: boolean;
    description?: string;
    personality?: string;
    tone?: string;
    expertise?: string[];
    contextMemory?: number;
    // Additional properties from Firebase
    userId?: string;
    ownerID?: string;
    createdAt?: string;
    systemMessage?: string;
    totalQueries?: number;
    tokensUsed?: number;
    totalChats?: number;
  }