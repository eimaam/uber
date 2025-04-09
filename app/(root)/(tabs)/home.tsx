import * as Location from "expo-location";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons, images } from "@/constants";
import { useAuthStore } from "@/lib/auth";
import { axiosInstance } from "@/lib/auth";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";

const Home = () => {
  const { user } = useAuthStore();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow location access to use this app"
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Get address from coordinates
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setUserLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to get location");
    }
  }, []);

  // Fetch rides
  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/ride/user/${user?._id}`);
        if (data.data) {
          setRecentRides(data.data);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchRecentRides();
    }
  }, [user?._id]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/book-ride");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={recentRides.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        className="px-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex-row items-center justify-between my-5">
              <View>
                <Text className="text-lg font-JakartaRegular">
                  Welcome back 👋
                </Text>
                <Text className="text-2xl font-JakartaBold">
                  {user?.fullName}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/profile")}
              >
                <View className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center">
                  <Text className="text-xl font-JakartaBold">
                    {user?.fullName?.charAt(0)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            {location && (
              <>
                <Text className="text-xl font-JakartaBold mt-5 mb-3">
                  Your current location
                </Text>
                <View className="h-[300px] w-full">
                  <Map
                    currentLocation={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                  />
                </View>
              </>
            )}

            {/* Quick Actions */}
            <Text className="text-xl font-JakartaBold mt-5 mb-4">
              Quick Actions
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 bg-primary-50 rounded-xl p-4 mr-2"
                onPress={() => router.push("/book-ride")}
              >
                <Image source={icons.map} className="w-8 h-8" />
                <Text className="text-lg font-JakartaSemiBold mt-2">
                  Book a Ride
                </Text>
                <Text className="text-sm text-gray-500">
                  Find nearby drivers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-primary-50 rounded-xl p-4 ml-2"
                onPress={() => router.push("/(root)/(tabs)/rides")}
              >
                <Image source={icons.list} className="w-8 h-8" />
                <Text className="text-lg font-JakartaSemiBold mt-2">
                  Your Rides
                </Text>
                <Text className="text-sm text-gray-500">View ride history</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Home;
