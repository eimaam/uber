import connectDB from "@/lib/db";
import Ride from "@/models/Ride";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const rides = await Ride.find({ user_id: id })
      .populate({
        path: "driver_id",
        select:
          "first_name last_name profile_image_url car_image_url car_seats rating",
      })
      .sort({ createdAt: -1 }); // Most recent first

    // Transform the response to match the expected format
    const formattedRides = rides.map((ride) => ({
      ride_id: ride._id,
      origin_address: ride.origin_address,
      destination_address: ride.destination_address,
      origin_latitude: ride.origin_latitude,
      origin_longitude: ride.origin_longitude,
      destination_latitude: ride.destination_latitude,
      destination_longitude: ride.destination_longitude,
      ride_time: ride.ride_time,
      fare_price: ride.fare_price,
      payment_status: ride.payment_status,
      created_at: ride.createdAt,
      driver: {
        driver_id: ride.driver_id._id,
        first_name: ride.driver_id.first_name,
        last_name: ride.driver_id.last_name,
        profile_image_url: ride.driver_id.profile_image_url,
        car_image_url: ride.driver_id.car_image_url,
        car_seats: ride.driver_id.car_seats,
        rating: ride.driver_id.rating,
      },
    }));

    return Response.json({ data: formattedRides });
  } catch (error: any) {
    console.error("Error fetching user rides:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
