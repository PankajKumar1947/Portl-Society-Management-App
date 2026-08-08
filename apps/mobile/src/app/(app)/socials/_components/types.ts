export interface Comment {
  id: string;
  authorName: string;
  authorRole: "resident" | "admin" | "guard";
  authorRoleLabel: string;
  content: string;
  time: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorRole: "resident" | "admin" | "guard";
  authorRoleLabel: string;
  authorAvatar?: string;
  time: string;
  content: string;
  images?: string[];
  likes: number;
  commentsCount: number;
  comments: Comment[];
  hasLiked: boolean;
}
