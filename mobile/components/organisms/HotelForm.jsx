import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import InputText from "../InputText"
import BottomSheetSelect from "../BottomSheetSelect"
import { HOTEL_TYPES } from "../../constants/hotel"

export default function HotelForm({
  hotel,
  onSubmit,
  isLoading = false,
  submitLabel,
  isEdit = false,
  footerContent = null,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ hotel })

  console.log("\n\n--hotel", hotel)

  useEffect(() => {
    reset(hotel)
  }, [hotel])

  const hotel_type = watch("hotel_type")
  console.log("\n\n--hotel_type", hotel_type)
  
  const isMultiRoom = hotel_type === "hotel" || hotel_type === "resort"

  const [images, setImages] = useState(["https://picsum.photos/300/200"])
  const [tempImage, setTempImage] = useState("")

  const handleAddImage = () => {
    if (!tempImage.trim()) return
    setImages((prev) => [...prev, tempImage.trim()])
    setTempImage("")
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const buttonLabel = submitLabel ? submitLabel({ isMultiRoom, isEdit }) : isEdit ? "Update Hotel" : isMultiRoom ? "Next — Add Rooms" : "Create Hotel"

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Hotel Name */}
        <InputText label="Hotel Name" placeholder="e.g. Grand Resort" control={control} name="name" isRequired error={errors.name?.message} />

        {/* Hotel Type + Contact Phone — hidden on edit (type cannot change) */}
        {!isEdit && (
          <View style={styles.row}>
            <Controller
              control={control}
              name="hotel_type"
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, value } }) => (
                <BottomSheetSelect
                  label="Hotel Type"
                  options={HOTEL_TYPES}
                  value={value}
                  onChange={onChange}
                  placeholder="Select Type"
                  title="Select Hotel Type"
                  isRequired
                  style={{ flex: 1 }}
                  error={errors.hotel_type?.message}
                />
              )}
            />
            <InputText
              label="Contact Phone"
              placeholder="+91 98765 43210"
              control={control}
              name="contact_phone"
              isRequired
              error={errors.contact_phone?.message}
              style={{ flex: 1 }}
              keyboardType="phone-pad"
            />
          </View>
        )}

        {/* Contact Email */}
        <InputText
          label="Contact Email"
          placeholder="hotel@example.com"
          control={control}
          name="contact_email"
          isRequired
          error={errors.contact_email?.message}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Country + State */}
        <View style={styles.row}>
          <InputText
            label="Country"
            placeholder="e.g. India"
            control={control}
            name="country"
            isRequired
            error={errors.country?.message}
            style={{ flex: 1 }}
          />
          <InputText
            label="State"
            placeholder="e.g. Maharashtra"
            control={control}
            name="state"
            isRequired
            error={errors.state?.message}
            style={{ flex: 1 }}
          />
        </View>

        {/* District + Address */}
        <View style={styles.row}>
          <InputText
            label="District"
            placeholder="e.g. Mumbai"
            control={control}
            name="district"
            isRequired
            error={errors.district?.message}
            style={{ flex: 1 }}
          />
          <InputText
            label="Full Address"
            placeholder="e.g. 123 Main St"
            control={control}
            name="address"
            isRequired
            error={errors.address?.message}
            style={{ flex: 1 }}
          />
        </View>

        {/* Description */}
        <InputText
          label="Description"
          placeholder="Describe your hotel..."
          control={control}
          name="description"
          error={errors.description?.message}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          inputWrapperStyle={{ height: 120, minHeight: 120 }}
        />

        {/* Images */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Images</Text>
          <View style={[styles.row, { alignItems: "center" }]}>
            <TextInput
              style={[styles.urlInput, { flex: 1, marginRight: Spacing.sm }]}
              placeholder="Enter image URL"
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
                <Ionicons name="trash-outline" size={20} color={Colors.red} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit((data) => onSubmit(data, images))}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitButtonText}>{buttonLabel}</Text>}
        </TouchableOpacity>

        {/* Extra content injected by parent (e.g. Manage Rooms button) */}
        {footerContent}
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
  formGroup: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    marginBottom: Spacing.xs,
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
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
  },
})
