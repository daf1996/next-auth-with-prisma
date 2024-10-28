import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    await prisma.document.findUnique({
      where: { id: Number(params.id) },
    })
  );
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, filePath, published, editNo } = await req.json();
    return NextResponse.json(
      await prisma.document.update({
        where: { id: Number(params.id) },
        data: { title, filePath, published, editNo },
      })
    );
  } catch (error) {
    return new NextResponse(error as BodyInit, {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    return NextResponse.json(
      await prisma.document.delete({
        where: { id: Number(params.id) },
      })
    );
  } catch (error) {
    return new NextResponse(error as BodyInit, {
      status: 500,
    });
  }
}
