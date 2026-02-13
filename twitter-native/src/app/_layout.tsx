import { ClerkProvider } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "./global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache}>
        <StatusBar style="dark" translucent />
        <Stack screenOptions={{ headerShown: false }} />
      </ClerkProvider>
    </QueryClientProvider>
  )
}
