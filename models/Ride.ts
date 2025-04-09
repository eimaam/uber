import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    origin_address: {
      type: String,
      required: true,
    },
    destination_address: {
      type: String,
      required: true,
    },
    origin_latitude: {
      type: Number,
      required: true,
    },
    origin_longitude: {
      type: Number,
      required: true,
    },
    destination_latitude: {
      type: Number,
      required: true,
    },
    destination_longitude: {
      type: Number,
      required: true,
    },
    ride_time: {
      type: Number,
      required: true,
    },
    fare_price: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
rideSchema.index({ user_id: 1, created_at: -1 });
rideSchema.index({ driver_id: 1, created_at: -1 });

const Ride = mongoose.models.Ride || mongoose.model("Ride", rideSchema);

export default Ride;
