import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { JwtPayload } from './types'
export function verifyToken(request:NextRequest): JwtPayload | null{
  try {
    const jwtToken = request.cookies.get("jwtToken")
    const token = jwtToken?.value as string
    if(!token) return null
    const privateKey = process.env.JWT_SECRET as string
    const userPayload = jwt.verify(token, privateKey) as JwtPayload
    return userPayload
  } catch (error) {
    return null
  }
}

export function verifyTokenForpage(token:string): JwtPayload | null{
  try {
    if(!token) return null
    const privateKey = process.env.JWT_SECRET as string
    const userPayload = jwt.verify(token, privateKey) as JwtPayload
    if (!userPayload)  return null
    return userPayload
  } catch (error) {
    return null
  }
}