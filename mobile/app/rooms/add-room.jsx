import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useMutation } from "../../hooks/use-mutation"
import { createRoom } from "../../services/rooms"
import RoomForm from "../../components/organisms/RoomForm"
import { TouchableOpacity } from "react-native"

export default function AddRoomScreen() {
  const router = useRouter()
  const { hotel_id } = useLocalSearchParams()

  const [savedRooms, setSavedRooms] = useState([])
  // key is used to fully reset RoomForm between adds
  const [formKey, setFormKey] = useState(0)

  const { mutate, isLoading } = useMutation({
    mutationFn: createRoom,
    onSuccess: (createdRoom) => {
      setSavedRooms((prev) => [...prev, createdRoom])
      // Bump key to unmount/remount RoomForm — cleanest full reset
      setFormKey((k) => k + 1)
    },
  })

  const handleSubmit = (formData, amenities, images) => {
    mutate({ hotel_id, ...formData, amenities, images })
  }

  const onDone = () => {
    router.replace("/hotels")
  }

  const footerContent =
    savedRooms.length > 0 ? (
      <TouchableOpacity style={styles.doneButton} onPress={onDone}>
        <Ionicons name="checkmark-done-outline" size={20} color={Colors.white} style={{ marginRight: 6 }} />
        <Text style={styles.doneButtonText}>Done — Go to My Hotels</Text>
      </TouchableOpacity>
    ) : null

  const bannerContent =
    savedRooms.length > 0 ? (
      <View style={styles.banner}>
        <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
        <Text style={styles.bannerText}>
          {savedRooms.length} room{savedRooms.length > 1 ? "s" : ""} added — fill another or tap Done
        </Text>
      </View>
    ) : null

  return (
    <View style={{ flex: 1 }}>
      {bannerContent}
      <RoomForm
        key={formKey}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Add Room"
        submitIcon="add-circle-outline"
        footerContent={footerContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  bannerText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    flex: 1,
  },
  doneButton: {
    backgroundColor: "#22C55E",
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  doneButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
  },
})
