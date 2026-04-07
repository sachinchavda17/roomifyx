import { View, Text, StyleSheet, Alert } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { Link, useRouter } from "expo-router"
import { useAuth } from "../../context/AuthContext"
import { useQuery } from "../../hooks/use-query"
import { useMutation } from "../../hooks/use-mutation"
import { profile, deleteAccount } from "../../services/user"
import { AnimatedHeaderScrollView } from "../../components/organisms/animated-header-scrollview"
import { Avatar } from "../../components/base/avatar"
import { useRef, useMemo } from "react"
import EditProfile from "../../components/EditProfile"
import { ThemeSwitch, useThemeColors } from "../../components/organisms/theme-switch"

export default function ProfileScreen() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const editProfileRef = useRef(null)
  const colors = useThemeColors()

  const { isLoading, data } = useQuery({
    queryKey: ["profile"],
    queryFn: profile,
    enabled: isAuthenticated,
  })
  console.log("profile ", data)

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await logout()
      // router.replace("/(tabs)")
    },
    showSuccess: true,
  })

  const handleLogout = async () => {
    await logout()
    // router.replace("/(tabs)")
  }

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to delete your account? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMutation.mutate()
        },
      },
    ])
  }

  const firstName = isAuthenticated && data ? data.first_name : ""
  const lastName = isAuthenticated && data ? data.last_name : ""
  const displayName = isAuthenticated && data ? `${firstName} ${lastName}` : "Guest"
  const email = isAuthenticated && data ? data.email : "Log in to view your profile"
  const role = isAuthenticated && data ? data.role : "user"

  const userData = useMemo(
    () => ({
      firstName,
      lastName,
      email,
      role,
    }),
    [firstName, lastName, email, role],
  )

  const openEditProfile = () => {
    editProfileRef.current?.expand()
  }

  return (
    <>
      <AnimatedHeaderScrollView
        largeTitle="Profile"
      >
        <View style={styles.content}>
          <View style={[styles.profileHeader, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <Avatar image={{ name: displayName }} size={70} showBorder={true} borderColor={colors.border} borderWidth={1} />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: colors.black }]}>{displayName}</Text>
              <Text style={[styles.userEmail, { color: colors.darkGray }]}>{email}</Text>
            </View>
            {isAuthenticated && (
              <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.lightGray, borderColor: colors.border }]} onPress={openEditProfile}>
                <Ionicons name="pencil-outline" size={15} color={colors.black} />
              </TouchableOpacity>
            )}
          </View>
          {!isAuthenticated && (
            <View style={[styles.loginCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <View style={styles.loginCardContent}>
                <Text style={[styles.loginCardTitle, { color: colors.black }]}>Log in for the best experience</Text>
                <Text style={[styles.loginCardSubtitle, { color: colors.darkGray }]}>Access your bookings, saved places, and more from any device.</Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity style={[styles.loginCardButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.loginCardButtonText}>Log in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.black }]}>Account Settings</Text>
            {/* <MenuLink icon="person-outline" title="Personal info" colors={colors} /> */}
            <MenuLink icon="shield-checkmark-outline" title="Login & security" colors={colors} />
            <MenuLink icon="card-outline" title="Payments & payouts" colors={colors} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.black }]}>Hosting</Text>
            <MenuLink icon="business-outline" title="Manage Hotels" href="/hotels" colors={colors} />
            <MenuLink icon="add-circle-outline" title="List your space" colors={colors} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.black }]}>Preferences</Text>
            <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="moon-outline" size={22} color={colors.black} />
              </View>
              <Text style={[styles.menuText, { flex: 1, color: colors.black }]}>Dark Mode</Text>
              <ThemeSwitch />
            </View>
            <MenuLink icon="settings-outline" title="Settings" colors={colors} />
          </View>

          {isAuthenticated && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Danger Zone</Text>
                <TouchableOpacity onPress={handleDeleteAccount} disabled={deleteMutation.isLoading}>
                  <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                    <View style={styles.menuIconContainer}>
                      <Ionicons name="trash-outline" size={22} color={colors.primary} />
                    </View>
                    <Text style={[styles.menuText, { color: colors.primary }]}>Delete Account</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </AnimatedHeaderScrollView>

      <EditProfile ref={editProfileRef} user={userData} />
    </>
  )
}

function MenuLink({ icon, title, href, colors }) {
  const content = (
    <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color={colors.black} />
      </View>
      <Text style={[styles.menuText, { color: colors.black }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.darkGray} />
    </View>
  )

  if (href) {
    return (
      <Link href={href} asChild>
        <TouchableOpacity activeOpacity={0.7}>{content}</TouchableOpacity>
      </Link>
    )
  }

  return <TouchableOpacity activeOpacity={0.7}>{content}</TouchableOpacity>
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },
  profileHeader: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.black,
  },
  userEmail: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.black,
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  loginCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  loginCardTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.black,
    marginBottom: 8,
  },
  loginCardSubtitle: {
    fontSize: Typography.size.md,
    color: Colors.darkGray,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  loginCardButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  loginCardButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconContainer: {
    width: 32,
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.size.md,
    color: Colors.black,
  },
  logoutButton: {
    marginTop: Spacing.md,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
  },
  logoutText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: "#FF385C",
  },
  editButton: {
    position: "absolute",
    // top: 5,
    right: 5,
    bottom: 5,
    padding: Spacing.sm,
    borderRadius: 100,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 999,
  },
})
