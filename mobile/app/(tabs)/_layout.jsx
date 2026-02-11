import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../../constants/Theme"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.darkGray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          borderTopWidth: 0.5,
          borderTopColor: Colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}

