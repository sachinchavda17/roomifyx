import { Stack, Link } from "expo-router"
import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../../constants/Theme"

export default function HotelsLayout() {
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
      <Stack.Screen
        name="index"
        options={{
          title: "My Hotels",
          headerRight: () => (
            <Link href="/hotels/add" asChild>
              <TouchableOpacity style={{ padding: 4 }}>
                <Ionicons name="add" size={28} color={Colors.primary} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="add" options={{ title: "Add Hotel" }} />
      <Stack.Screen name="add-room" options={{ title: "Add Rooms" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit Hotel" }} />
    </Stack>
  )
}

