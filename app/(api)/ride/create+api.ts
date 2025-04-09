import connectDB from "@/lib/db";
import Ride from "@/models/Ride";
import Driver from "@/models/Driver";

export async function POST(request: Request) {
  try {
    await connectDB();
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = await request.json();

    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !payment_status ||
      !driver_id ||
      !user_id
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify driver exists
    const driver = await Driver.findById(driver_id);
    if (!driver) {
      return Response.json({ error: "Driver not found" }, { status: 404 });
    }

    const ride = await Ride.create({
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    });

    // Populate driver details
    await ride.populate("driver_id");

    return Response.json({
      message: "Ride created successfully",
      data: ride,
    });
  } catch (error: any) {
    console.error("Error creating ride:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
