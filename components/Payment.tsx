import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { useAuthStore } from "@/lib/auth";
import { axiosInstance } from "@/lib/auth";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/types/type";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useAuthStore();
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const [success, setSuccess] = useState<boolean>(false);

  const openPaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } = await axiosInstance.post(
        "/(api)/stripe/create",
        {
          amount: amount * 100,
        }
      );

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        merchantDisplayName: "Uber",
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert("Error", presentError.message);
        return;
      }

      // Create ride
      await axiosInstance.post("/(api)/ride/create", {
        userId: user?.id,
        driverId,
        pickupLocation: userAddress,
        dropoffLocation: destinationAddress,
        pickupCoordinates: {
          latitude: userLatitude,
          longitude: userLongitude,
        },
        dropoffCoordinates: {
          latitude: destinationLatitude,
          longitude: destinationLongitude,
        },
        status: "pending",
        price: amount,
        estimatedTime: rideTime,
      });

      setSuccess(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <CustomButton
        title={`Pay $${amount}`}
        onPress={openPaymentSheet}
        className="mt-4"
      />

      <ReactNativeModal
        isVisible={success}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="bg-white p-5 rounded-3xl items-center">
          <Image source={images.check} className="w-20 h-20" />
          <Text className="text-xl font-JakartaBold text-center mt-4">
            Payment Successful
          </Text>
          <Text className="text-general-500 text-center mt-2">
            Your payment has been processed successfully
          </Text>
          <CustomButton
            title="View Ride"
            onPress={() => {
              setSuccess(false);
              router.push("/(root)/(tabs)/rides");
            }}
            className="mt-4"
          />
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default Payment;
