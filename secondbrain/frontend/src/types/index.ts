export type ContentType = 'youtube' | 'twitter' | 'reddit' | 'instagram' | 'article' | 'other';

export interface ContentItem {
  _id: string;
  userId: string;
  type: ContentType;
  url: string;
  title: string;
  tags: string[];
  createdAt: string;
}

export interface User {
  token: string;
  username: string;
}

export interface SharedBrain {
  username: string;
  content: ContentItem[];
}
