import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "../context/AuthContext"
import { ToastProviderWithViewport } from "../components/molecules/toast"

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ToastProviderWithViewport>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="hotels" options={{ headerShown: false }} />
                <Stack.Screen name="hotel-detail" options={{ headerShown: false }} />
              </Stack>
            </ToastProviderWithViewport>
          </GestureHandlerRootView>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

