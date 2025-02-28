export interface Message {
    id: string;
    role: "user" | "assistant" | "model";
    content: string;
    timestamp: string;
    image?: string | null;
  }


 export interface Chat {
  chatID: string | undefined;
  userID: string;
  agentID:string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "archived" | "deleted";
  metadata?: {
    model?: string;
    temperature?: number;
    context?: string;
    tags?: string[];
  };
  lastMessageAt: string;
 } 