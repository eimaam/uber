import { Image, Text, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";
import { useAuthStore } from "@/lib/auth";
import { icons } from "@/constants";

const Profile = () => {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/welcome");
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-JakartaBold mb-8">Profile</Text>

      <View className="flex-row items-center mb-8">
        <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center">
          <Text className="text-2xl font-JakartaBold">
            {user?.fullName?.charAt(0)}
          </Text>
        </View>
        <View className="ml-4">
          <Text className="text-xl font-JakartaSemiBold">{user?.fullName}</Text>
          <Text className="text-gray-500">{user?.email}</Text>
        </View>
      </View>

      <View className="space-y-4">
        <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl">
          <Image source={icons.person} className="w-6 h-6" />
          <Text className="ml-4 text-lg font-JakartaMedium">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl">
          <Image source={icons.lock} className="w-6 h-6" />
          <Text className="ml-4 text-lg font-JakartaMedium">Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center p-4 bg-gray-50 rounded-xl"
          onPress={handleSignOut}
        >
          <Image source={icons.out} className="w-6 h-6" />
          <Text className="ml-4 text-lg font-JakartaMedium">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
