import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json(await prisma.document.findMany())
}

export async function POST(req: Request) {
  try {
    // console.log(await req);
    const { department, type, title, filePath, author } = await req.json();
    console.log(department, type, title, filePath, author);

    const docsNo = await prisma.document.count({
      where: {
        department: {
          contains: department,
        },
        type: {
          contains: type,
        },
      },
    });

    const newPost = await prisma.document.create({
      data: {
        type: type,
        title: title,
        filePath: filePath,
        author: author,
        department: department,
        docNo: docsNo + 1,
      },
    });
    return NextResponse.json(newPost);
  } catch (error) {
    return new NextResponse(error as BodyInit, {
      status: 500,
    });
  }
}