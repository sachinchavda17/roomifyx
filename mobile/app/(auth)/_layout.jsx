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
        // headerTintColor: Colors.black,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          // title: "Log In",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          // title: "Sign up",
          headerShown: false,
        }}
      />
    </Stack>
  )
}

