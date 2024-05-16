import jwt from "jsonwebtoken";
import { JwtPayload } from "./types";
import {serialize} from "cookie"

export function generanteJWT(jwtPayload:JwtPayload) : string{
  const privateKey = process.env.JWT_SECRET as string
  const token = jwt.sign(jwtPayload ,privateKey,{expiresIn:"30d"});
  return token
}
export function setCookie(jwtPayload:JwtPayload) : string {
const token = generanteJWT(jwtPayload)
const cookie =  serialize("jwtToken",token,{
  httpOnly:true,
  secure:process.env.NODE_ENV === "development",
  sameSite:"strict",
  path:"/",
  maxAge: 60 * 60 * 24 * 30,
})
return cookie
}