import { Image, Text, View } from "react-native";
import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { Ride } from "@/types/type";

type SimpleRideProps = {
  pickup: string;
  dropoff: string;
  date: string;
  price: number;
  status: string;
};

type RideCardProps = {
  ride?: Ride;
} & Partial<SimpleRideProps>;

const RideCard = (props: RideCardProps) => {
  const { ride, pickup, dropoff, date, price, status } = props;

  // Use Google Maps Static API instead of Geoapify
  const staticMapUrl = ride
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${ride.destination_latitude},${ride.destination_longitude}&zoom=14&size=600x400&scale=2&markers=color:red%7C${ride.destination_latitude},${ride.destination_longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
    : `https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=14&size=600x400&scale=2&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;

  // If we have a full ride object, use that, otherwise use the simple props
  const displayData = ride
    ? {
        originAddress: ride.origin_address,
        destinationAddress: ride.destination_address,
        date: formatDate(ride.created_at),
        time: formatTime(ride.ride_time),
        driverName: `${ride.driver.first_name} ${ride.driver.last_name}`,
        carSeats: ride.driver.car_seats,
        paymentStatus: ride.payment_status,
      }
    : {
        originAddress: pickup || "N/A",
        destinationAddress: dropoff || "N/A",
        date: date || "N/A",
        time: "",
        driverName: "N/A",
        carSeats: "N/A",
        paymentStatus: status || "N/A",
      };

  return (
    <View className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
      <View className="flex flex-col items-start justify-center p-3">
        <View className="flex flex-row items-center justify-between">
          <Image
            source={{ uri: staticMapUrl }}
            className="w-[80px] h-[90px] rounded-lg"
          />
          <View className="flex flex-col mx-5 gap-y-5 flex-1">
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                {displayData.originAddress}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                {displayData.destinationAddress}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex flex-col w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center">
          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Date & Time
            </Text>
            <Text className="text-md font-JakartaBold" numberOfLines={1}>
              {displayData.date}
              {displayData.time ? `, ${displayData.time}` : ""}
            </Text>
          </View>
          {ride && (
            <>
              <View className="flex flex-row items-center w-full justify-between mb-5">
                <Text className="text-md font-JakartaMedium text-gray-500">
                  Driver
                </Text>
                <Text className="text-md font-JakartaBold">
                  {displayData.driverName}
                </Text>
              </View>
              <View className="flex flex-row items-center w-full justify-between mb-5">
                <Text className="text-md font-JakartaMedium text-gray-500">
                  Car Seats
                </Text>
                <Text className="text-md font-JakartaBold">
                  {displayData.carSeats}
                </Text>
              </View>
            </>
          )}
          <View className="flex flex-row items-center w-full justify-between">
            <Text className="text-md font-JakartaMedium text-gray-500">
              {ride ? "Payment Status" : "Status"}
            </Text>
            <Text
              className={`text-md capitalize font-JakartaBold ${
                displayData.paymentStatus.toLowerCase() === "paid" ||
                displayData.paymentStatus.toLowerCase() === "completed"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {displayData.paymentStatus}
            </Text>
          </View>
          {!ride && price && (
            <View className="flex flex-row items-center w-full justify-between mt-5">
              <Text className="text-md font-JakartaMedium text-gray-500">
                Price
              </Text>
              <Text className="text-md font-JakartaBold">
                ${price.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default RideCard;
