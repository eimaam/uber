import { StripeProvider } from "@stripe/stripe-react-native";
import { Image, Text, View } from "react-native";

import Payment from "@/components/Payment";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useAuthStore } from "@/lib/auth";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";

const BookRide = () => {
  const { user } = useAuthStore();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.filter(
    (driver) => +driver.id === selectedDriver,
  )[0];

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.uber"
      urlScheme="myapp"
    >
      <RideLayout title="Book Ride">
        <>
          <Text className="text-xl font-JakartaSemiBold mb-3">
            Ride Details
          </Text>

          <View className="flex-row items-center gap-x-3 mb-4">
            <View>
              <Image source={icons.from} className="w-6 h-6" />
              <View className="h-10 border-l border-dashed border-neutral-300 ml-[11px]" />
              <Image source={icons.to} className="w-6 h-6" />
            </View>

            <View className="flex-1">
              <Text className="font-JakartaMedium text-lg">{userAddress}</Text>
              <View style={{ height: 40 }} />
              <Text className="font-JakartaMedium text-lg">
                {destinationAddress}
              </Text>
            </View>
          </View>

          {driverDetails && (
            <Payment
              fullName={user?.fullName || ""}
              email={user?.email || ""}
              amount={driverDetails.price}
              driverId={driverDetails.id}
              rideTime={formatTime(driverDetails.time)}
            />
          )}
        </>
      </RideLayout>
    </StripeProvider>
  );
};

export default BookRide;
