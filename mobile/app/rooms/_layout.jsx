import { Stack } from "expo-router"
import { useThemeColors } from "../../components/organisms/theme-switch"

export default function RoomsLayout() {
  const colors = useThemeColors()

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerShadowVisible: false,
        headerTintColor: colors.black,
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Manage Rooms" }} />
      <Stack.Screen name="add-room" options={{ title: "Add Room" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit Room" }} />
    </Stack>
  )
}
