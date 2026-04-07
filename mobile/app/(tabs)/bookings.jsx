import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useAuth } from "../../context/AuthContext"
import { Link } from "expo-router"
import { AnimatedHeaderScrollView } from "../../components/organisms/animated-header-scrollview"
import { useThemeColors } from "../../components/organisms/theme-switch"

export default function BookingsScreen() {
  const { isAuthenticated } = useAuth()
  const colors = useThemeColors()

  return (
    <AnimatedHeaderScrollView
      largeTitle="Bookings"
    >
      <View style={styles.content}>
        {isAuthenticated ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={80} color={colors.lightGray} />
            <Text style={[styles.emptyTitle, { color: colors.black }]}>No trips booked... yet!</Text>
            <Text style={[styles.emptySubtitle, { color: colors.darkGray }]}>Time to dust off your bags and start planning your next adventure.</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="log-in-outline" size={80} color={colors.lightGray} />
            <Text style={[styles.emptyTitle, { color: colors.black }]}>Log in to see your bookings</Text>
            <Text style={[styles.emptySubtitle, { color: colors.darkGray }]}>You can find your past and future trips here once you log in.</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.loginButtonText, { color: colors.white }]}>Log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </AnimatedHeaderScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
    minHeight: 400, // Ensure enough height for visual balance
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    marginTop: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    marginTop: Spacing.lg,
    color: Colors.black,
  },
  emptySubtitle: {
    fontSize: Typography.size.md,
    color: Colors.darkGray,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: Spacing.xl,
  },
  loginButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
  },
})

