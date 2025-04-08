import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { useAuthStore } from "@/lib/auth";
import { axiosInstance } from "@/lib/auth";

const SignUp = () => {
  const { setToken, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const onSignUpPress = async () => {
    if (!form.fullName || !form.email || !form.phoneNumber || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/signup", form);

      // response.data already contains the parsed data due to axios interceptor
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        router.replace("/(root)/(tabs)/home");
      } else {
        Alert.alert("Error", "Invalid response from server");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      Alert.alert("Error", err.message || "Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            CreateX Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Full Name"
            placeholder="Enter full name"
            icon={icons.person}
            value={form.fullName}
            onChangeText={(value) => setForm({ ...form, fullName: value })}
          />
          <InputField
            label="Phone Number"
            placeholder="Enter phone number"
            icon={icons.person}
            keyboardType="phone-pad"
            value={form.phoneNumber}
            onChangeText={(value) => setForm({ ...form, phoneNumber: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            loading={loading}
            className="mt-6"
          />

          {/* <OAuth /> */}

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
