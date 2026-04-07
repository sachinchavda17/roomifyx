import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { CurvedBottomTabs } from "../../components/base/curved-bottom-tabs"
import { useThemeColors } from "../../components/organisms/theme-switch"

export default function TabLayout() {
  const colors = useThemeColors()

  return (
    <Tabs
      tabBar={(props) => <CurvedBottomTabs {...props} gradients={[colors.lightGray, colors.darkGray]} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
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
