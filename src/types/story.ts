export interface Story {
  id: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}
