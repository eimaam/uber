import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    profile_image_url: {
      type: String,
      required: false,
    },
    car_image_url: {
      type: String,
      required: false,
    },
    car_seats: {
      type: Number,
      required: true,
      min: 1,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.models.Driver || mongoose.model("Driver", driverSchema);

export default Driver;
