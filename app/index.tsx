import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/auth";

const Page = () => {
  const { isSignedIn } = useAuthStore();

  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
