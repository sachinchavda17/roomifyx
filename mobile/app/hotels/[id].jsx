import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useQuery } from "../../hooks/use-query"
import { useMutation } from "../../hooks/use-mutation"
import { getPublicHotel, updateHotel } from "../../services/hotels"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import HotelForm from "../../components/organisms/HotelForm"
import { Ionicons } from "@expo/vector-icons"
import { MULTI_ROOM_TYPES } from "../../constants/hotel"
import Button from "../../components/base/button"

export default function EditHotelScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: getPublicHotel, // meybe change
    payload: { id },
    enabled: !!id,
  })

  const payload = { payload: data, id }
  const { mutate, isPending } = useMutation({
    mutationFn: updateHotel,
    payload,
    onSuccess: () => {
      const isMultiRoom = MULTI_ROOM_TYPES.includes(data?.hotel_type)
      if (!isMultiRoom) router.back()
    },
  })

  if (isLoading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  const handleSubmit = (data, images) => mutate({ ...data, images })

  const RoomManageButton = () => {
    return (
      <View style={styles.manageRoomsSection}>
        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Rooms</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.manageRoomsHint}>This is a multi-room property. You can add or update its rooms below.</Text>

        <Button
          onPress={() => router.push({ pathname: "/rooms", params: { hotel_id: id } })}
          backgroundColor={Colors.secondary}
          width="100%"
          height={50}
          borderRadius={12}
        >
          <Ionicons name="bed-outline" size={20} color={Colors.white} style={{ marginRight: Spacing.sm }} />
          <Text style={styles.manageRoomsText}>Manage Rooms</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.white} style={{ marginLeft: "auto" }} />
        </Button>
      </View>
    )
  }

  return (
    <HotelForm
      isEdit
      defaultValues={data}
      isLoading={isPending}
      onSubmit={handleSubmit}
      footerContent={MULTI_ROOM_TYPES.includes(data?.hotel_type) ? <RoomManageButton /> : null}
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
  manageRoomsText: {
    color: Colors.white,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
  },
})
