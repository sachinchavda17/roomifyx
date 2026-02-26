import { useRouter } from "expo-router"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "../../hooks/use-mutation"
import { createHotel } from "../../services/hotels"
import HotelForm from "../../components/organisms/HotelForm"
import { MULTI_ROOM_TYPES } from "../../constants/hotel"

export default function AddHotelScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const defaultValues = {
    name: "hotel 3",
    hotel_type: "apartment",
    contact_email: "hotel@gmail.com",
    contact_phone: "1234567890",
    country: "India",
    state: "Maharashtra",
    district: "Mumbai",
    address: "123 Main St",
    description: "This is a hotel",
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: createHotel,
    onSuccess: (createdHotel) => {
      // refresh the my-hotels list
      queryClient.invalidateQueries({ queryKey: ["my-hotels"] })

      const isMultiRoom = MULTI_ROOM_TYPES.includes(createdHotel.hotel_type)
      if (isMultiRoom) router.replace({ pathname: "/rooms/add-room", params: { hotel_id: createdHotel.id } })
      else router.back()
    },
  })

  const handleSubmit = (data, images) => mutate({ ...data, images })

  return <HotelForm defaultValues={defaultValues} isLoading={isLoading} onSubmit={handleSubmit} />
}
