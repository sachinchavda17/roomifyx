import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Typography, Spacing } from "../constants/Theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function SearchHeader() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
        <Ionicons name="search" size={20} color={Colors.primary} style={{ marginLeft: 15 }} />
        <View style={styles.searchContent}>
          <Text style={styles.searchTitle}>Where to?</Text>
          <Text style={styles.searchSubtitle}>Anywhere • Any week • Add guests</Text>
        </View>
        <View style={styles.filterIcon}>
          <Ionicons name="options-outline" size={20} color={Colors.black} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  searchContent: {
    flex: 1,
    marginLeft: 15,
  },
  searchTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
  },
  searchSubtitle: {
    fontSize: Typography.size.xs,
    color: Colors.darkGray,
  },
  filterIcon: {
    marginRight: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
})

