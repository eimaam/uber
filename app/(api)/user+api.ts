import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { fullName, email, phoneNumber, password } = await request.json();

    if (!fullName || !email || !phoneNumber || !password) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
    });

    // Don't send password in response
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return new Response(JSON.stringify({ data: userResponse }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
