import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import RideCard from "@/components/RideCard";
import { useAuthStore } from "@/lib/auth";
import { axiosInstance } from "@/lib/auth";
import { Ride } from "@/types/type";

const Rides = () => {
  const { user } = useAuthStore();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/ride/user/${user?._id}`);
        setRides(data.data || []);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchRides();
    }
  }, [user?._id]);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-JakartaBold mb-8">Your Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.ride_id.toString()}
        renderItem={({ item }) => <RideCard ride={item} />}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-4">
            {loading ? "Loading rides..." : "No rides found"}
          </Text>
        }
      />
    </View>
  );
};

export default Rides;
