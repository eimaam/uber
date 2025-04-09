import dotenv from "dotenv";
dotenv.config();

import connectDB from "../lib/db";
import Driver from "../models/Driver";

const drivers = [
  {
    first_name: "James",
    last_name: "Wilson",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 4,
    rating: 4.8,
  },
  {
    first_name: "Michael",
    last_name: "Johnson",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 6,
    rating: 4.9,
  },
  {
    first_name: "William",
    last_name: "Brown",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 4,
    rating: 4.75,
  },
];

async function seedDrivers() {
  try {
    await connectDB();

    // Clear existing drivers
    await Driver.deleteMany({});

    // Insert new drivers
    await Driver.insertMany(drivers);

    console.log("Drivers seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding drivers:", error);
    process.exit(1);
  }
}

seedDrivers();
