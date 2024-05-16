import { NextRequest,NextResponse } from "next/server"
import prisma from "@/utils/db"
import { UpdateCommentDataTransfereObject } from "@/utils/DataTransfereObjects"
import { verifyToken } from "@/utils/verifiyToken"

interface Props{
  params:{id:string}
}

/**
 *  @method  PUT
 *  @route   ~/api/comments/:id
 *  @desc    Update Comment
 *  @access  private
 */
export async function PUT(request:NextRequest,{params}:Props){
  try {
    const comment = await prisma.comment.findUnique({
      where:{
        id:parseInt(params.id)
      }
    })
    if(!comment){
      return NextResponse.json({message:"Comment Not Found"},{status:404})
    }
    const user = verifyToken(request)
    if(user === null || user.id !== comment.userId ){
      return NextResponse.json({message:"not allowed"},{status:403})
    }
    const body : UpdateCommentDataTransfereObject =  await request.json()
    const updatedComment = await prisma.comment.update({
      where:{
        id : parseInt(params.id)
      },
      data:{
        text:body.text,
        
      }
    })
    return NextResponse.json(updatedComment,{status:200})
  } catch (error) {
    return NextResponse.json({message:"internal server error"} , {status:500})
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/comments/:id
 *  @desc    Delete Comment
 *  @access  private
 */
export async function DELETE(request:NextRequest,{params}:Props){
  try {
    const comment = await prisma.comment.findUnique({
      where:{
        id:parseInt(params.id)
      }
    })
    if(!comment){
      return NextResponse.json({message:"Comment Not Found"},{status:404})
    }
    const user = verifyToken(request)
    if(user === null){
      return NextResponse.json({message:" no token ,not allowed"},{status:403})
    }
    if( user.id === comment.userId || user.isAdmin === true ){
      await prisma.comment.delete({where:{id : parseInt(params.id)}})
      return NextResponse.json({message : "comment deleted successfully"},{status:200})
    }
  } catch (error) {
    return NextResponse.json({message:"internal server error"} , {status:500})
  }
}
