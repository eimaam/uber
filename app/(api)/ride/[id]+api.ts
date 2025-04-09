import connectDB from "@/lib/db";
import Ride from "@/models/Ride";
import { isValidObjectId } from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id || !isValidObjectId(id)) {
    return Response.json({ error: "Invalid ride ID" }, { status: 400 });
  }

  try {
    await connectDB();

    const ride = await Ride.findById(id).populate({
      path: "driver_id",
      select:
        "first_name last_name profile_image_url car_image_url car_seats rating",
    });

    if (!ride) {
      return Response.json({ error: "Ride not found" }, { status: 404 });
    }

    // Transform response to match existing format
    const response = {
      ...ride.toObject(),
      ride_id: ride._id,
      driver: {
        driver_id: ride.driver_id._id,
        first_name: ride.driver_id.first_name,
        last_name: ride.driver_id.last_name,
        profile_image_url: ride.driver_id.profile_image_url,
        car_image_url: ride.driver_id.car_image_url,
        car_seats: ride.driver_id.car_seats,
        rating: ride.driver_id.rating,
      },
    };

    delete response._id;
    delete response.__v;
    delete response.driver_id;

    return Response.json({ data: response });
  } catch (error: any) {
    console.error("Error fetching ride:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
