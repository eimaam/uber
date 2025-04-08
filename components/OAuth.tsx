import { Image, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";

const OAuth = () => {
  // Commented out for future implementation
  /*
  const handleGoogleSignIn = async () => {
    // TODO: Implement Google OAuth
  };
  */

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      {/* Commented out for future implementation */}
      {/*
      <CustomButton
        title="Continue with Google"
        variant="secondary"
        icon={<Image source={icons.google} className="w-5 h-5" />}
        onPress={handleGoogleSignIn}
        className="mt-4"
      />
      */}
    </View>
  );
};

export default OAuth;
