import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import InputText from "../InputText"
import BottomSheetSelect from "../BottomSheetSelect"
import { COMMON_AMENITIES, ROOM_TYPES } from "@/constants/hotel"
import { Button } from "../base/button"
import { useThemeColors } from "../organisms/theme-switch"

export default function RoomForm({
  defaultValues = {},
  onSubmit,
  isLoading = false,
  submitLabel = "Save",
  submitIcon = "save-outline",
  footerContent = null,
}) {
  const colors = useThemeColors()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  const [tempImage, setTempImage] = useState("")

  // Pre-fill form when defaultValues arrive (edit mode)
  useEffect(() => {
    if (!defaultValues || Object.keys(defaultValues).length === 0) return
    reset({
      room_number: defaultValues.room_number,
      title: defaultValues.title,
      description: defaultValues.description,
      room_type: defaultValues.room_type,
      price: defaultValues.price != null ? String(defaultValues.price) : "",
      location: defaultValues.location,
    })
    setAmenities(defaultValues.amenities ?? [])
    setImages(defaultValues.images ?? [])
  }, [defaultValues?.id]) // re-run only when a different room is loaded

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

  const handleSave = (data) => {
    onSubmit(
      {
        room_number: data.room_number,
        title: data.title,
        description: data.description,
        room_type: data.room_type,
        price: parseFloat(data.price),
        location: data.location,
      },
      amenities,
      images,
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={[styles.container, { backgroundColor: colors.white }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
              style={[styles.urlInput, { flex: 1, marginRight: Spacing.sm, color: colors.black, borderColor: colors.lightGray, backgroundColor: colors.white }]}
              placeholder="Paste image URL"
              value={tempImage}
              onChangeText={setTempImage}
              autoCapitalize="none"
              placeholderTextColor={colors.darkGray}
            />
            <TouchableOpacity onPress={handleAddImage} style={styles.addImageButton}>
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

        {/* Submit Button */}
        <Button
          onPress={handleSubmit(handleSave)}
          isLoading={isLoading}
          loadingText={submitLabel}
          backgroundColor={Colors.primary}
          width="100%"
          height={50}
          borderRadius={12}
          showLoadingIndicator
          style={{ marginTop: Spacing.sm, marginBottom: Spacing.md }}
        >
          <Ionicons name={submitIcon} size={20} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.submitButtonText}>{submitLabel}</Text>
        </Button>

        {footerContent}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  row: { flexDirection: "row", gap: Spacing.sm },
  section: { marginBottom: Spacing.lg },
  sectionLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  amenityChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  amenityChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  amenityChipText: { fontSize: Typography.size.sm, color: Colors.darkGray },
  amenityChipTextSelected: { color: Colors.white, fontWeight: Typography.weight.semibold },
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
  addImageButton: {
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
    backgroundColor: "#F3F4F6",
    padding: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.sm,
  },
  imageText: { flex: 1, marginRight: Spacing.sm, fontSize: Typography.size.sm, color: Colors.black },
  submitButtonText: { color: Colors.white, fontWeight: Typography.weight.bold, fontSize: Typography.size.md },
})
