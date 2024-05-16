import { CreateCommentDataTransfereObject } from "@/utils/DataTransfereObjects";
import prisma from "@/utils/db";
import { createCommentSchema } from "@/utils/validationSchemas";
import { verifyToken } from "@/utils/verifiyToken";
import { NextResponse,NextRequest } from "next/server";

/**
 *  @method  POST
 *  @route   ~/api/comments
 *  @desc    Create New Comment
 *  @access  private
 */
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if(!user){
      return NextResponse.json({message:"login first"},{status:401})
    }
    const body = await request.json() as CreateCommentDataTransfereObject
    const validation = createCommentSchema.safeParse(body)
    if(!validation.success){
      return NextResponse.json({message:validation.error.errors[0].message},{status:400})
    }
    const newComment = await prisma.comment.create({
      data:{
        text:body.text,
        articleId:body.articleId,
        userId:user.id
      }
    })
  return NextResponse.json(newComment,{status:201})
  } catch (error) {
    return NextResponse.json({ message: "internal server error" },{status:500});
  }
}

/**
 *  @method  GET
 *  @route   ~/api/comments
 *  @desc    Get All Comments
 *  @access  private
 */
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if(user?.isAdmin===false || user?.isAdmin === null){
      return NextResponse.json({message:"forbidden"},{status:403})
    }
    const comments = await prisma.comment.findMany()
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "internal server error" },{status:500});
  }
}