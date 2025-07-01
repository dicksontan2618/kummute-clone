export interface User {
  id: string;
  email: string;
}

export interface Conversation {
  id: string;
  user1: string;
  user2: string;
  created_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
