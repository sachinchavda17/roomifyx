import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useForm, Controller } from "react-hook-form"
import { useState } from "react"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useMutation } from "../../hooks/use-mutation"
import { createRoom } from "../../services/rooms"
import InputText from "../../components/InputText"
import BottomSheetSelect from "../../components/BottomSheetSelect"

const ROOM_TYPES = [
  { label: "🛏️  Standard", value: "standard" },
  { label: "⭐  Premium", value: "premium" },
  { label: "💎  Deluxe", value: "deluxe" },
  { label: "👑  Suite", value: "suite" },
]

const COMMON_AMENITIES = ["WiFi", "AC", "TV", "Hot Water", "Room Service", "Mini Bar", "Balcony", "Parking", "Gym", "Pool"]

export default function AddRoomScreen() {
  const router = useRouter()
  const { hotel_id } = useLocalSearchParams()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      room_number: "101",
      title: "delux king room",
      description: "this is delux king room",
      room_type: "deluxe",
      price: "2500",
      location: "mumbai",
    },
  })

  const [amenities, setAmenities] = useState(["WiFi", "AC", "TV"])
  const [images, setImages] = useState(['https://picsum.photos/300/200'])
  const [tempImage, setTempImage] = useState("")
  const [savedRooms, setSavedRooms] = useState([])

  const toggleAmenity = (item) => {
    setAmenities((prev) => (prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]))
  }

  const handleAddImage = () => {
    if (!tempImage.trim()) return
    setImages((prev) => [...prev, tempImage.trim()])
    setTempImage("")
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: createRoom,
    onSuccess: (createdRoom) => {
      setSavedRooms((prev) => [...prev, createdRoom])
      // Reset form so owner can add another room
      reset()
      setAmenities([])
      setImages([])
    },
  })

  const onAddRoom = (data) => {
    console.log("\ndata payload", {
      hotel_id,
      room_number: data.room_number,
      title: data.title,
      description: data.description,
      room_type: data.room_type,
      price: parseFloat(data.price),
      location: data.location,
      amenities,
      images,
    })

    mutate({
      hotel_id,
      room_number: data.room_number,
      title: data.title,
      description: data.description,
      room_type: data.room_type,
      price: parseFloat(data.price),
      location: data.location,
      amenities,
      images,
    })
  }

  const onDone = () => {
    router.replace("/hotels")
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Saved rooms banner */}
        {savedRooms.length > 0 && (
          <View style={styles.banner}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
            <Text style={styles.bannerText}>
              {savedRooms.length} room{savedRooms.length > 1 ? "s" : ""} added — fill another or tap Done
            </Text>
          </View>
        )}

        {/* Room Number + Room Type */}
        <View style={styles.row}>
          <InputText
            label="Room Number"
            placeholder="e.g. 101"
            control={control}
            name="room_number"
            isRequired
            error={errors.room_number?.message}
            style={{ flex: 1 }}
          />
          <Controller
            control={control}
            name="room_type"
            rules={{ required: "This field is required" }}
            render={({ field: { onChange, value } }) => (
              <BottomSheetSelect
                label="Room Type"
                options={ROOM_TYPES}
                value={value}
                onChange={onChange}
                placeholder="Select Type"
                title="Select Room Type"
                isRequired
                style={{ flex: 1 }}
                error={errors.room_type?.message}
              />
            )}
          />
        </View>

        {/* Title */}
        <InputText
          label="Room Title"
          placeholder="e.g. Deluxe King Room with Sea View"
          control={control}
          name="title"
          isRequired
          error={errors.title?.message}
          rules={{
            required: "Title is required",
            minLength: { value: 5, message: "Min 5 characters" },
          }}
        />

        {/* Description */}
        <InputText
          label="Description"
          placeholder="Describe the room in detail (min 20 chars)..."
          control={control}
          name="description"
          isRequired
          error={errors.description?.message}
          rules={{
            required: "Description is required",
            minLength: { value: 20, message: "Min 20 characters" },
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          inputWrapperStyle={{ height: 110, minHeight: 110 }}
        />

        {/* Price + Location */}
        <View style={styles.row}>
          <InputText
            label="Price / Night (₹)"
            placeholder="e.g. 2500"
            control={control}
            name="price"
            isRequired
            error={errors.price?.message}
            style={{ flex: 1 }}
            keyboardType="numeric"
            rules={{
              required: "Price is required",
              pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Enter a valid price" },
            }}
          />
          <InputText
            label="Location"
            placeholder="e.g. Mumbai, India"
            control={control}
            name="location"
            isRequired
            error={errors.location?.message}
            style={{ flex: 1 }}
          />
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {COMMON_AMENITIES.map((item) => {
              const selected = amenities.includes(item)
              return (
                <TouchableOpacity key={item} style={[styles.amenityChip, selected && styles.amenityChipSelected]} onPress={() => toggleAmenity(item)}>
                  <Text style={[styles.amenityChipText, selected && styles.amenityChipTextSelected]}>{item}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Room Images</Text>
          <View style={[styles.row, { alignItems: "center" }]}>
            <TextInput
              style={[styles.urlInput, { flex: 1, marginRight: Spacing.sm }]}
              placeholder="Paste image URL"
              value={tempImage}
              onChangeText={setTempImage}
              autoCapitalize="none"
              placeholderTextColor={Colors.darkGray}
            />
            <TouchableOpacity onPress={handleAddImage} style={styles.addButton}>
              <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
          {images.map((img, index) => (
            <View key={index} style={styles.imageItem}>
              <Text numberOfLines={1} style={styles.imageText}>
                {img}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveImage(index)}>
                <Ionicons name="trash-outline" size={18} color={Colors.red} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Room Button */}
        <TouchableOpacity style={[styles.addRoomButton, isLoading && styles.disabledButton]} onPress={handleSubmit(onAddRoom)} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <View style={styles.btnRow}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.addRoomButtonText}>Add Room</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Done — only shows after at least 1 room is saved */}
        {savedRooms.length > 0 && (
          <TouchableOpacity style={styles.doneButton} onPress={onDone}>
            <Ionicons name="checkmark-done-outline" size={20} color={Colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.doneButtonText}>Done — Go to My Hotels</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  bannerText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  amenityChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  amenityChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  amenityChipText: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
  },
  amenityChipTextSelected: {
    color: Colors.white,
    fontWeight: Typography.weight.semibold,
  },
  urlInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: Typography.size.md,
    color: Colors.black,
    backgroundColor: Colors.white,
    height: 50,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
  },
  imageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.gray?.[200] ?? "#F3F4F6",
    padding: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.sm,
  },
  imageText: {
    flex: 1,
    marginRight: Spacing.sm,
    fontSize: Typography.size.sm,
    color: Colors.black,
  },
  addRoomButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  doneButton: {
    backgroundColor: "#22C55E",
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginTop: Spacing.md,
    flexDirection: "row",
    justifyContent: "center",
  },
  doneButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addRoomButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
})
