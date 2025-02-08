export interface Message {
    id: string;
    role: "user" | "assistant" | 'model';
    content: string;
    timestamp: string;
  }