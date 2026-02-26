import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useQueryClient } from "@tanstack/react-query"
import { useQuery } from "../../hooks/use-query"
import { useMutation } from "../../hooks/use-mutation"
import { getRoomById, updateRoom } from "../../services/rooms"
import { Colors } from "../../constants/Theme"
import RoomForm from "../../components/organisms/RoomForm"

export default function EditRoomScreen() {
  const router = useRouter()
  const { room_id, hotel_id } = useLocalSearchParams()
  const queryClient = useQueryClient()

  const { data: room, isLoading , refetch} = useQuery({
    queryKey: ["room", room_id],
    queryFn: getRoomById,
    payload: room_id,
    enabled: !!room_id,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateRoom({ room_id, data }),
    onSuccess: () => {
      refetch()
      queryClient.invalidateQueries({ queryKey: ["hotel-rooms", hotel_id] })
      router.back()
    },
  })

  const handleSubmit = (formData, amenities, images) => {
    mutate({ ...formData, amenities, images })
  }

  if (isLoading || !room) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return <RoomForm defaultValues={room} onSubmit={handleSubmit} isLoading={isPending} submitLabel="Save Changes" submitIcon="save-outline" />
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})
