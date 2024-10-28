import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Using a raw query to fetch departments
    const departments = await prisma.$queryRaw`SELECT concat(name,' (',shortName,')') as label, shortName as value FROM department`;

    // Return the result as a JSON response
    return NextResponse.json(departments);
  } catch (error) {
    // Handle any errors here and return a meaningful response
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}
