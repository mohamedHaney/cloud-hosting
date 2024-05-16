import {z} from "zod"
export const createArticleSchema = z.object({
  title:z.string({required_error:"title is required"}).min(2).max(200),
  description:z.string({required_error:"description is required"}).min(10)
})
export const createUserSchema = z.object({
  username:z.string({required_error:"username is required"}).min(2).max(30),
  email:z.string({required_error:"email is required"}).email(),
  password:z.string({required_error:"password is required"}).min(6)
})
export const loginUserSchema = z.object({
  email:z.string({required_error:"email is required"}).email(),
  password:z.string({required_error:"password is required"}).min(6)
})
export const createCommentSchema = z.object({
  text: z.string().min(2).max(500),
  articleId:z.number()
})

export const UpdateUserSchema = z.object({
  username:z.string({required_error:"username is required"}).min(2).max(30).optional(),
  email:z.string({required_error:"email is required"}).email().optional(),
  password:z.string({required_error:"password is required"}).min(6).optional()
})