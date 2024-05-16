import { NextRequest, NextResponse } from "next/server";
import { UpdateArticlDataTransfereObject } from "@/utils/DataTransfereObjects";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifiyToken";

interface Props {
  params: { id: string };
}

/**
 *  @method  GET
 *  @route   ~/api/articles/:id
 *  @desc    Get Single Article
 *  @access  public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        comments: {
          include: { user: { select: { username: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article Not Found" },
        { status: 404 }
      );
    }
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  PUT
 *  @route   ~/api/articles/:id
 *  @desc    Update Article
 *  @access  private
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json({ message: "only admins" }, { status: 403 });
    }
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article Not Found" },
        { status: 404 }
      );
    }
    const body: UpdateArticlDataTransfereObject = await request.json();
    const updatedArticle = await prisma.article.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        title: body.title,
        description: body.description,
      },
    });
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/articles/:id
 *  @desc    Delete Article
 *  @access  private
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json({ message: "only admins" }, { status: 403 });
    }
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include:{
        comments:true
      }
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article Not Found" },
        { status: 404 }
      );
    }
    await prisma.article.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    const commentsIds:number[] = article?.comments.map( comment => comment.id )
    await prisma.comment.deleteMany(({
      where:{id:{in:commentsIds}}
    }))
    return NextResponse.json({ message: "Article deleted"}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
