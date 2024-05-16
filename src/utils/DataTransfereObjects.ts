export interface CreateArticlDataTransfereObject {
  title: string;
  description: string;
}
export interface UpdateArticlDataTransfereObject {
  title?: string;
  description?: string;
}
export interface RegisterUserDataTransfereObject {
  username: string;
  email: string;
  password:string
}
export interface LoginUserDataTransfereObject {
  email: string;
  password:string
}
export interface UpdateUserDataTransfereObject {
  username?: string;
  password?:string
}
export interface CreateCommentDataTransfereObject {
  text:string,
  articleId:number
}
export interface UpdateCommentDataTransfereObject {
  text:string,
}