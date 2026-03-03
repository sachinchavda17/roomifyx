import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useQueryClient } from "@tanstack/react-query"
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
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["hotel", id],
    queryFn: getPublicHotel,
    payload: { id },
    enabled: !!id,
  })

  const { mutate, isLoading: isSaving } = useMutation({
    mutationFn: updateHotel,
    onSuccess: (createdHotel) => {
      // refresh the my-hotels list
      refetch()
      queryClient.invalidateQueries({ queryKey: ["my-hotels"] })

      const isMultiRoom = MULTI_ROOM_TYPES.includes(createdHotel.hotel_type)
      if (isMultiRoom) router.replace({ pathname: "/rooms/add-room", params: { hotel_id: createdHotel.id } })
      else router.back()
    },
  })

  if (isLoading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  const defaultValues = {
    ...data,
    price: data.price != null ? String(data.price) : "",
    max_guests: data.max_guests != null ? String(data.max_guests) : "",
  }

  const handleSubmit = (formData, images) => mutate({ payload: { ...formData, images }, id })

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
      defaultValues={defaultValues}
      isLoading={isSaving}
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
})
