import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Colors, Spacing, Typography } from "../../constants/Theme"

export default function BookingsScreen() {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Bookings</Text>
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={80} color={Colors.lightGray} />
          <Text style={styles.emptyTitle}>No trips booked... yet!</Text>
          <Text style={styles.emptySubtitle}>Time to dust off your bags and start planning your next adventure.</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
})

