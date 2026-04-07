import { Stack, Link } from "expo-router"
import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useThemeColors } from "../../components/organisms/theme-switch"

export default function HotelsLayout() {
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
      <Stack.Screen
        name="index"
        options={{
          title: "My Hotels",
          headerRight: () => (
            <Link href="/hotels/add" asChild>
              <TouchableOpacity style={{ padding: 4 }}>
                <Ionicons name="add" size={28} color={colors.primary} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="add" options={{ title: "Add Hotel" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit Hotel" }} />
    </Stack>
  )
}
