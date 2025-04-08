import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/lib/auth";

export default function AuthLayout() {
  const { isSignedIn } = useAuthStore();

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
