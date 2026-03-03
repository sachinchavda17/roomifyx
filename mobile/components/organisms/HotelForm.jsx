import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import InputText from "../InputText"
import BottomSheetSelect from "../BottomSheetSelect"
import { HOTEL_TYPES, COMMON_AMENITIES } from "../../constants/hotel"
import Button from "../base/button"
import { useLocalSearchParams, useRouter } from "expo-router"

export default function HotelForm({ defaultValues = null, onSubmit, isLoading = false, isEdit = false, footerContent = null }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({ defaultValues: defaultValues ?? {}, mode: "onChange" })

  useEffect(() => {
    if (!defaultValues || Object.keys(defaultValues).length === 0) return
    reset(defaultValues)
    if (defaultValues.images?.length) {
      setImages(defaultValues.images)
    }
    if (defaultValues.amenities?.length) {
      setAmenities(defaultValues.amenities)
    }
  }, [defaultValues])

  const hotel_type = watch("hotel_type")
  const isMultiRoom = hotel_type === "hotel" || hotel_type === "resort"
  const isGuestHouse = hotel_type === "guest_house"

  const [images, setImages] = useState(defaultValues?.images?.length ? defaultValues.images : [])
  const [tempImage, setTempImage] = useState("")
  const [amenities, setAmenities] = useState(defaultValues?.amenities?.length ? defaultValues.amenities : [])

  const handleAddImage = () => {
    if (!tempImage.trim()) return
    setImages((prev) => [...prev, tempImage.trim()])
    setTempImage("")
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (item) => {
    setAmenities((prev) => (prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]))
  }

  const buttonLabel = isEdit ? "Update Hotel" : isMultiRoom ? "Next — Add Rooms" : "Create Hotel"

  const handleFormSubmit = (data) => {
    // Strip guest-house-only fields from base payload to avoid backend validation errors
    const { price, max_guests, ...rest } = data
    const payload = { ...rest }

    // Only include price / max_guests for guest houses (they have gt=0 validators on the backend)
    if (isGuestHouse) {
      payload.amenities = amenities
      if (price) payload.price = parseFloat(price)
      if (max_guests) payload.max_guests = parseInt(max_guests, 10)
    }

    onSubmit(payload, images)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Hotel Name */}
        <InputText label="Hotel Name" placeholder="Grand Resort" control={control} name="name" isRequired error={errors.name?.message} />

        {/* Hotel Type + Contact Phone */}
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
                disabled={isEdit}
              />
            )}
          />
          <InputText
            label="Contact Phone"
            placeholder="+91 12345 12345"
            control={control}
            name="contact_phone"
            isRequired
            error={errors.contact_phone?.message}
            style={{ flex: 1 }}
            keyboardType="phone-pad"
          />
        </View>

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
            placeholder="India"
            control={control}
            name="country"
            isRequired
            error={errors.country?.message}
            style={{ flex: 1 }}
          />
          <InputText
            label="State"
            placeholder="Maharashtra"
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
            placeholder="Mumbai"
            control={control}
            name="district"
            isRequired
            error={errors.district?.message}
            style={{ flex: 1 }}
          />
          <InputText
            label="Full Address"
            placeholder="123 Main St"
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
          numberOfLines={3}
          textAlignVertical="top"
          inputWrapperStyle={{ height: 120, minHeight: 120 }}
        />

        {/* Guest House specific fields */}
        {isGuestHouse && (
          <>
            <View style={styles.sectionDivider}>
              <View style={styles.sectionDividerLine} />
              <Text style={styles.sectionDividerText}>Property Details</Text>
              <View style={styles.sectionDividerLine} />
            </View>

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
                label="Max Guests"
                placeholder="e.g. 4"
                control={control}
                name="max_guests"
                error={errors.max_guests?.message}
                style={{ flex: 1 }}
                keyboardType="numeric"
                rules={{
                  pattern: { value: /^\d+$/, message: "Enter a valid number" },
                }}
              />
            </View>

            {/* Amenities */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {COMMON_AMENITIES.map((item) => {
                  const selected = amenities.includes(item)
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.amenityChip, selected && styles.amenityChipSelected]}
                      onPress={() => toggleAmenity(item)}
                    >
                      <Text style={[styles.amenityChipText, selected && styles.amenityChipTextSelected]}>{item}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </>
        )}

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
        <Button
          onPress={handleSubmit(handleFormSubmit)}
          isLoading={isLoading}
          disabled={isLoading || !isValid}
          backgroundColor={Colors.primary}
          loadingTextBackgroundColor={Colors.primary}
          loadingText="Saving..."
          loadingTextColor={Colors.white}
          width="100%"
          height={50}
          borderRadius={12}
          showLoadingIndicator
        >
          <Text style={styles.submitButtonText}>{buttonLabel}</Text>
        </Button>

        {/* Extra content injected by parent (e.g. Manage Rooms button) */}
        {isMultiRoom && <RoomManageButton />}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const RoomManageButton = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()

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
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  sectionDividerText: {
    marginHorizontal: Spacing.sm,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.darkGray,
    textTransform: "uppercase",
    letterSpacing: 1,
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
  submitButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
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
