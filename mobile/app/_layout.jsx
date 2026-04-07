import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "../context/AuthContext"
import { ToastProviderWithViewport } from "../components/molecules/toast"
import { ThemeProvider, useTheme } from "../components/organisms/theme-switch"

const queryClient = new QueryClient()

function AppContent() {
  const { isDark, colors } = useTheme()
  return (
    <ToastProviderWithViewport>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.white },
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.black,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="hotels" options={{ headerShown: false }} />
        <Stack.Screen name="hotel-detail" options={{ headerShown: false }} />
        <Stack.Screen name="reserve" options={{ headerShown: false, presentation: "modal" }} />
      </Stack>
    </ToastProviderWithViewport>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </GestureHandlerRootView>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

