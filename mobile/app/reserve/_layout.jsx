import { Stack } from "expo-router"

export default function ReserveLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="[id]" />
        </Stack>
    )
}
