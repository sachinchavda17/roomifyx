import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useAuth } from "../../context/AuthContext"
import { Link } from "expo-router"
import { AnimatedHeaderScrollView } from "../../components/organisms/animated-header-scrollview"

export default function BookingsScreen() {
  const { isAuthenticated } = useAuth()

  return (
    <AnimatedHeaderScrollView
      largeTitle="Bookings"
      headerBlurConfig={{
        intensity: 20,
        tint: "light",
      }}
    >
      <View style={styles.content}>
        {isAuthenticated ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={80} color={Colors.lightGray} />
            <Text style={styles.emptyTitle}>No trips booked... yet!</Text>
            <Text style={styles.emptySubtitle}>Time to dust off your bags and start planning your next adventure.</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="log-in-outline" size={80} color={Colors.lightGray} />
            <Text style={styles.emptyTitle}>Log in to see your bookings</Text>
            <Text style={styles.emptySubtitle}>You can find your past and future trips here once you log in.</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Log in</Text>
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

