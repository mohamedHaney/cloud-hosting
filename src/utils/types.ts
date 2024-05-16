import { Article, User, Comment } from "@prisma/client";
export type JwtPayload = {
  id: number;
  isAdmin: boolean;
  username: string;
};
export type CommentWithUser = Comment & { user: User };
export type SingleArticle = Article & { comments: CommentWithUser[] };
