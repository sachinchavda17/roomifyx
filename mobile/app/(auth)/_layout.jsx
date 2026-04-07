import { Stack } from "expo-router"
import { useThemeColors } from "../../components/organisms/theme-switch"

export default function AuthLayout() {
  const colors = useThemeColors()

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
        headerTintColor: colors.black,
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}
