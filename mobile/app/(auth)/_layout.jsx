import { Stack } from "expo-router"
import { Colors } from "../../constants/Theme"

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
        headerTintColor: Colors.black,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Log in",
          // headerLeft: () => null, // Optional: handle back navigation if needed
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign up",
        }}
      />
    </Stack>
  )
}

