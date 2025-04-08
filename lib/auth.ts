import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import axios from 'axios';

type AuthState = {
  token: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  } | null;
  isSignedIn: boolean;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  signOut: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      isSignedIn: false,
      setToken: (token) => set({ token, isSignedIn: true }),
      setUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null, isSignedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject auth token
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    throw new Error(message);
  }
);

// Export the configured axios instance
export const axiosInstance = api;

// Replace fetchAPI with a new implementation using axios
export const fetchAPI = async (endpoint: string, options: any = {}) => {
  try {
    const method = options.method?.toLowerCase() || 'get';
    const data = options.body ? JSON.parse(options.body) : undefined;
    
    const response = await api({
      method,
      url: endpoint,
      data,
      ...options,
    });
    
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, setActive, signUp } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
    });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });

        if (signUp.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }

        return {
          success: true,
          code: "success",
          message: "You have successfully signed in with Google",
        };
      }
    }

    return {
      success: false,
      message: "An error occurred while signing in with Google",
    };
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      code: err.code,
      message: err?.errors[0]?.longMessage,
    };
  }
};
