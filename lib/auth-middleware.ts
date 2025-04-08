import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
      // Add user info to request for downstream handlers
      (req as any).user = decoded;
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}
