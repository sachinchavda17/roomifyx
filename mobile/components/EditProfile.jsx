import { View, Text, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from "react-native"
import React, { forwardRef, useState, useEffect } from "react"
import BottomSheet from "./templates/bottom-sheet"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Spacing, Typography } from "../constants/Theme"
import InputText from "./InputText"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "expo-router"
import { useMutation } from "../hooks/use-mutation"
import { updateProfile, deleteAccount } from "../services/user"
import Button from "./base/button"
import { Avatar } from "./base/avatar"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const EditProfile = forwardRef(({ user }, ref) => {
  const { logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    role: user?.role || "guest",
  })
  const [originalData, setOriginalData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    role: user?.role || "guest",
  })

  useEffect(() => {
    const userData = {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role || "guest",
    }
    setFormData(userData)
    setOriginalData(userData)
  }, [user])

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setIsEditing(false)
    },
    showSuccess: true,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await logout()
      ref.current?.close()
      router.replace("/(auth)/login")
    },
    showSuccess: true,
  })

  const handleSave = () => {
    updateMutation.mutate({
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.role,
    })
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    ref.current?.close()
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

  const displayName = `${formData.firstName} ${formData.lastName}`.trim() || "Guest"

  return (
    <BottomSheet ref={ref} snapPoints={["60%", "90%"]} backgroundColor={Colors.white} backdropOpacity={0.6} borderRadius={32}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={styles.sheet}>
          {/* Header Section */}
          <View style={styles.header}>
            <Avatar image={{ name: displayName }} size={90} showBorder={true} borderColor={Colors.border} borderWidth={2} />
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{formData.email || "Guest User"}</Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            {isEditing ? (
              <>
                <Pressable style={[styles.actionItem, styles.activeActionItem]} onPress={handleSave} disabled={updateMutation.isLoading}>
                  <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                  <Text style={[styles.actionText, { color: Colors.primary }]}>Save Changes</Text>
                </Pressable>
                <View style={styles.actionDivider} />
                <Pressable style={styles.actionItem} onPress={handleCancel}>
                  <Ionicons name="close-circle-outline" size={22} color={Colors.gray[600]} />
                  <Text style={[styles.actionText, { color: Colors.gray[600] }]}>Cancel</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable style={styles.actionItem} onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={22} color={Colors.black} />
                  <Text style={styles.actionText}>Edit Profile</Text>
                </Pressable>
                <View style={styles.actionDivider} />
                <Pressable style={styles.actionItem} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={22} color="#ff453a" />
                  <Text style={[styles.actionText, { color: "#ff453a" }]}>Sign Out</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Form Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </View>
            <InputText
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              icon="person-outline"
              editable={isEditing}
              style={!isEditing && styles.disabledInput}
            />
            <InputText
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              icon="person-outline"
              editable={isEditing}
              style={!isEditing && styles.disabledInput}
            />
            <InputText label="Email Address" value={formData.email} editable={false} icon="mail-outline" style={styles.disabledInput} />
            <InputText
              label="Account Role"
              value={formData.role}
              onChangeText={(text) => setFormData({ ...formData, role: text.toLowerCase() })}
              editable={isEditing}
              icon="shield-outline"
              style={!isEditing && styles.disabledInput}
            />
          </View>

          {/* Danger Zone Section */}
          <View style={[styles.section, { paddingBottom: 100 }]}>
            <Text style={[styles.sectionTitle, { color: "#ff453a" }]}>Danger Zone</Text>
            <Button
              onPress={handleDeleteAccount}
              isLoading={deleteMutation.isLoading}
              backgroundColor="#FFF0F0"
              width={SCREEN_WIDTH - 48}
              height={56}
              borderRadius={16}
              style={styles.deleteButton}
            >
              <View style={styles.deleteBtnContent}>
                <Ionicons name="trash-outline" size={20} color="#ff453a" />
                <Text style={styles.deleteBtnText}>Delete Account Permanently</Text>
              </View>
            </Button>
            <Text style={styles.dangerNote}>This action is irreversible. All your booking history and preferences will be permanently erased.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  )
})

export default EditProfile

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  header: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: Typography.weight.bold,
    color: Colors.black,
    marginTop: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: Typography.size.md,
    color: Colors.gray[500],
    fontWeight: "400",
  },
  actionRow: {
    flexDirection: "row",
    backgroundColor: "#F2F4F7",
    borderRadius: 20,
    marginBottom: 32,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  activeActionItem: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionDivider: {
    width: 1,
    height: "50%",
    backgroundColor: Colors.border,
    alignSelf: "center",
  },
  actionText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: "600",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.gray[500],
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: Typography.weight.bold,
  },
  editLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  disabledInput: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    opacity: 0.9,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#FFDADA",
    marginTop: 4,
  },
  deleteBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteBtnText: {
    fontSize: 16,
    color: "#ff453a",
    fontWeight: Typography.weight.bold,
  },
  dangerNote: {
    fontSize: 12,
    color: Colors.gray[400],
    marginTop: 14,
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 18,
  },
})

