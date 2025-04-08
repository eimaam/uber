import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request): Promise<Response> {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Remove password from response
    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: userWithoutPassword,
        token,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        message: error.message || "Something went wrong during login",
      }),
      { status: 500 }
    );
  }
}
