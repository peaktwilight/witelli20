export interface Reply {
  id: string;
  text: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

export interface Message {
  id: string;
  text: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  replies?: Reply[];
  score?: number; // Calculated field for sorting
}

export interface MessageInput {
  text: string;
  parentId?: string; // For replies
}

export type TimePeriod = 'day' | 'week' | 'month' | 'all';

export type SortOption = 'smart' | 'newest' | 'popular';
