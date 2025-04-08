import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request): Promise<Response> {
  try {
    await connectDB();
    const { fullName, email, phoneNumber, password } = await request.json();

    // Validate input
    if (!fullName || !email || !phoneNumber || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "Invalid email format" }), {
        status: 400,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
    });

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
        message: "Registration successful",
        user: userWithoutPassword,
        token,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error details:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return new Response(
        JSON.stringify({ message: "This email is already registered" }),
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(", ");
      return new Response(JSON.stringify({ message }), { status: 400 });
    }

    return new Response(
      JSON.stringify({
        message: error.message || "Something went wrong during registration",
      }),
      { status: 500 }
    );
  }
}
