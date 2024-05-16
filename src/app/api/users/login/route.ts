import { LoginUserDataTransfereObject } from "@/utils/DataTransfereObjects";
import { loginUserSchema } from "@/utils/validationSchemas";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { setCookie } from "@/utils/generateToken";

/**
 *  @method  GET
 *  @route   ~/api/users/login
 *  @desc    Login User
 *  @access  public
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUserDataTransfereObject;
    const validation = loginUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json(
        { message: "invalid email or password" },
        { status: 400 }
      );
    }
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "invalid email or password" },
        { status: 400 }
      );
    }

    const cookie = setCookie({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    return NextResponse.json(
      { message: "Authenticated successfully" },
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}
