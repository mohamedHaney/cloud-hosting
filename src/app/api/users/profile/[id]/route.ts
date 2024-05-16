import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifiyToken";
import { UpdateUserDataTransfereObject } from "@/utils/DataTransfereObjects";
import bcrybt from "bcryptjs"
import { UpdateUserSchema } from "@/utils/validationSchemas";
interface Props {
  params: { id: string };
}

/**
 *  @method  DELETE
 *  @route   ~/api/users/profile
 *  @desc    Delete Profile
 *  @access  private
 */

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include:{
        comments:true
      }
    });
    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    const userFromToken = verifyToken(request);
    if (userFromToken !== null && userFromToken.id === user.id) {
      await prisma.user.delete({
        where: {
          id: parseInt(params.id),
        },
      });
      const commentsIds:number[] = user?.comments.map(comment=>comment.id)
      await prisma.comment.deleteMany({
        where:{id:{in:commentsIds}}
      })
      return NextResponse.json({ message: "User deleted" }, { status: 200 });
    }
    return NextResponse.json(
      { message: "only user him self can deleted his profile, forbidden" },
      { status: 403 }
    ); // forbidden
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  GET
 *  @route   ~/api/users/profile/:id
 *  @desc    Get Profile
 *  @access  private
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        email: true,
        username: true,
        isAdmin: true,
        createdAt: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json(
        { message: "not allowed, access denied" },
        { status: 404 }
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  PUT
 *  @route   ~/api/users/profile/:id
 *  @desc    Update Profile
 *  @access  private
 */

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json(
        { message: "access denied, not allowed" },
        { status: 403 }
      );
    }
    const body : UpdateUserDataTransfereObject = await request.json();
    const validation = UpdateUserSchema.safeParse(body)
    if(!validation.success){
      return NextResponse.json({message:validation.error.errors[0].message},{status:400})
    }
    if (body.password){
      const salt = await bcrybt.genSalt(10)
      body.password = await bcrybt.hash(body.password, salt)
    }
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        username: body.username,
        password: body.password,
      },
    });
    const {password , ...other} = updatedUser
    return NextResponse.json({...other},{status:200})
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
