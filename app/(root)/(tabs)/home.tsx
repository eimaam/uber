import * as Location from "expo-location";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons } from "@/constants";
import { useAuthStore } from "@/lib/auth";
import { fetchAPI } from "@/lib/auth";

const Home = () => {
  const { user } = useAuthStore();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow location access to use this app",
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to get location");
    }
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4">
        <View>
          <Text className="text-lg font-JakartaRegular">Welcome back 👋</Text>
          <Text className="text-2xl font-JakartaBold">{user?.fullName}</Text>
        </View>

        {/* Profile button */}
        <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/profile")}>
          <View className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center">
            <Text className="text-xl font-JakartaBold">
              {user?.fullName?.charAt(0)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      {location && (
        <View className="h-[45%] w-full">
          <Map
            currentLocation={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </View>
      )}

      {/* Quick Actions */}
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-xl font-JakartaBold mb-4">Quick Actions</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="flex-1 bg-primary-50 rounded-xl p-4 mr-2"
            onPress={() => router.push("/book-ride")}
          >
            <Image source={icons.map} className="w-8 h-8" />
            <Text className="text-lg font-JakartaSemiBold mt-2">Book a Ride</Text>
            <Text className="text-sm text-gray-500">Find nearby drivers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary-50 rounded-xl p-4 ml-2"
            onPress={() => router.push("/(root)/(tabs)/rides")}
          >
            <Image source={icons.list} className="w-8 h-8" />
            <Text className="text-lg font-JakartaSemiBold mt-2">Your Rides</Text>
            <Text className="text-sm text-gray-500">View ride history</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Rides */}
        <View className="mt-6">
          <Text className="text-xl font-JakartaBold mb-4">Recent Rides</Text>
          <RideCard
            pickup="123 Main St"
            dropoff="456 Market St"
            date="Today"
            price={25.99}
            status="completed"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
