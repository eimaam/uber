import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import RideCard from "@/components/RideCard";
import { useAuthStore } from "@/lib/auth";
import { axiosInstance } from "@/lib/auth";

const Rides = () => {
  const { user } = useAuthStore();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axiosInstance.get(`/(api)/ride/${user?.id}`);
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    if (user?.id) {
      fetchRides();
    }
  }, [user?.id]);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-JakartaBold mb-8">Your Rides</Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RideCard
            pickup={item.pickupLocation}
            dropoff={item.dropoffLocation}
            date={new Date(item.createdAt).toLocaleDateString()}
            price={item.price}
            status={item.status}
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-4">
            No rides found
          </Text>
        }
      />
    </View>
  );
};

export default Rides;
