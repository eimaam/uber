import { Redirect, Stack, Tabs } from "expo-router";
import { useAuthStore } from "@/lib/auth";

export default function RootLayout() {
  const { isSignedIn } = useAuthStore();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
