import connectDB from "@/lib/db";
import Driver from "@/models/Driver";

export async function GET(request: Request) {
  try {
    await connectDB();
    const drivers = await Driver.find({});

    return Response.json({ data: drivers });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
