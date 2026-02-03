import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Stack } from "expo-router"
import { Toaster } from "sonner-native"

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          title: "Roomifyx",
        }}
      />
      <Toaster />
    </GestureHandlerRootView>
  )
}

