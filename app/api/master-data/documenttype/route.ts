import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Using a raw query to fetch departments
    const documentType = await prisma.$queryRaw`SELECT concat(name,' (',typeName,')') as label, typeName as value FROM documenttype`;

    // Return the result as a JSON response
    return NextResponse.json(documentType);
  } catch (error) {
    // Handle any errors here and return a meaningful response
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}
