import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Stack } from "expo-router"
import { Toaster } from "sonner-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toaster />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

