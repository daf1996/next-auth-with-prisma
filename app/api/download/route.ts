import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const filename = url.searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ message: "Invalid filename" }, { status: 400 });
    }

    // Construct the file path
    const filePath = path.resolve("./public/uploads", filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Encode filename using RFC 5987 encoding for non-ASCII characters
    const encodedFilename = encodeURIComponent(filename).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");

    // Set headers with UTF-8 encoded filename
    const headers = new Headers({
      "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
      "Content-Type": "application/octet-stream",
    });

    // Create and return the file stream in the response
    const fileStream = fs.createReadStream(filePath);
    return new NextResponse(fileStream as any, { headers });
  } catch (error) {
    console.error("Error in download API:", error);
    return NextResponse.json({ message: "Error downloading file" }, { status: 500 });
  }
}
