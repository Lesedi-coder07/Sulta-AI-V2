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
  }