import { Stack } from "expo-router"
import { Colors } from "../../constants/Theme"

export default function RoomsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.black,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Manage Rooms" }} />
      <Stack.Screen name="add-room" options={{ title: "Add Room" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit Room" }} />
    </Stack>
  )
}
