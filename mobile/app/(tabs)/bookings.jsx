import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useAuth } from "../../context/AuthContext"
import { Link } from "expo-router"

export default function BookingsScreen() {
  const insets = useSafeAreaInsets()
  const { isAuthenticated } = useAuth()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Bookings</Text>

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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // marginBottom: 50,
  },
  content: {
    padding: Spacing.lg,
    flex: 1,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.xl,
    color: Colors.black,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
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

