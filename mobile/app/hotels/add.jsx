import { useRouter } from "expo-router"
import { useMutation } from "../../hooks/use-mutation"
import { createHotel } from "../../services/hotels"
import HotelForm from "../../components/organisms/HotelForm"

export default function AddHotelScreen() {
  const router = useRouter()

  const { mutate, isLoading } = useMutation({
    mutationFn: createHotel,
    onSuccess: (createdHotel, variables) => {
      const isMultiRoom = variables?.hotel_type === "hotel" || variables?.hotel_type === "resort"

      if (isMultiRoom) {
        router.replace({
          pathname: "/hotels/add-room",
          params: { hotel_id: createdHotel.id },
        })
      } else {
        router.back()
      }
    },
  })

  return (
    <HotelForm
      defaultValues={{
        name: "",
        hotel_type: "",
        contact_email: "",
        contact_phone: "",
        country: "",
        state: "",
        city: "",
        district: "",
        address: "",
        description: "",
      }}
      isLoading={isLoading}
      onSubmit={(data, images) => mutate({ ...data, images })}
    />
  )
}
