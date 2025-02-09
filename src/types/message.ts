export interface Message {
  id: string;
  text: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

export interface MessageInput {
  text: string;
}

export type TimePeriod = 'day' | 'week' | 'month' | 'all';
