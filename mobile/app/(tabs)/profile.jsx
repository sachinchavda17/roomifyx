import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Colors, Spacing, Typography } from "../../constants/Theme"

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.userName}>Sachin Chavda</Text>
            <Text style={styles.userEmail}>sachin@example.com</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <MenuLink icon="person-outline" title="Personal info" />
          <MenuLink icon="shield-checkmark-outline" title="Login & security" />
          <MenuLink icon="card-outline" title="Payments & payouts" />
          <MenuLink icon="settings-outline" title="Settings" />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function MenuLink({ icon, title }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={icon} size={24} color={Colors.black} />
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.xl,
    color: Colors.black,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  userName: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
  },
  userEmail: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
  },
  menu: {
    marginBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.size.md,
    color: Colors.black,
  },
  logoutButton: {
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  logoutText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
  },
})

