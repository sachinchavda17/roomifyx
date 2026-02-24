import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useQuery } from "../../hooks/use-query"
import { useMutation } from "../../hooks/use-mutation"
import { getPublicHotel, updateHotel } from "../../services/hotels"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import HotelForm from "../../components/organisms/HotelForm"
import { Ionicons } from "@expo/vector-icons"
import { MULTI_ROOM_TYPES } from "../../constants/hotel"

export default function EditHotelScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const { data: hotel, isLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: getPublicHotel, // meybe change
    payload: { id },
    enabled: !!id,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateHotel({ id, data }),
    onSuccess: () => {
      router.back()
    },
  })

  if (isLoading || !hotel) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  const isMultiRoom = MULTI_ROOM_TYPES.includes(hotel.hotel_type)

  return (
    <HotelForm
      isEdit
      hotel={hotel}
      isLoading={isPending}
      onSubmit={(data) => mutate(data)}
      footerContent={
        isMultiRoom ? (
          <View style={styles.manageRoomsSection}>
            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Rooms</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.manageRoomsHint}>This is a multi-room property. You can add or update its rooms below.</Text>

            <TouchableOpacity
              style={styles.manageRoomsButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/hotels/add-room",
                  params: { hotel_id: id },
                })
              }
            >
              <Ionicons name="bed-outline" size={20} color={Colors.white} style={{ marginRight: Spacing.sm }} />
              <Text style={styles.manageRoomsText}>Add / Manage Rooms</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.white} style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          </View>
        ) : null
      }
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  manageRoomsSection: {
    marginTop: Spacing.lg,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  dividerText: {
    marginHorizontal: Spacing.sm,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.darkGray,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  manageRoomsHint: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  manageRoomsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
  },
  manageRoomsText: {
    color: Colors.white,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
  },
})
