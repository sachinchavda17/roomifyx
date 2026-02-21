import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMutation } from "../../hooks/use-mutation"
import { createHotel } from "../../services/hotels"
import { useState } from "react"
import { useRouter, Stack } from "expo-router"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { Toast } from "../../components/molecules/toast"
import InputText from "../../components/InputText"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function AddHotelScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    images: [`https://picsum.photos/300/200`], // Unique random image
  })
  const [tempImage, setTempImage] = useState("")

  const handleAddImage = () => {
    if (!tempImage.trim()) return
    setFormData({ ...formData, images: [...formData.images, tempImage.trim()] })
    setTempImage("")
  }

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData({ ...formData, images: newImages })
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      Toast.show("Hotel created successfully", { type: "success" })
      router.back()
    },
    onError: (error) => {
      Toast.show(error.message || "Failed to create hotel", { type: "error" })
    },
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.city || !formData.address) {
      Toast.show("Please fill in required fields", { type: "error" })
      return
    }
    mutate(formData)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <InputText
        label="Hotel Name *"
        placeholder="e.g. Grand Resort"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <View style={styles.row}>
        <InputText
          label="City *"
          placeholder="e.g. New York"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          style={{ flex: 1, marginRight: Spacing.sm }}
        />
        <InputText
          label="Address *"
          placeholder="e.g. 123 Main St"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          style={{ flex: 1, marginLeft: Spacing.sm }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Images</Text>
        <View style={[styles.row, { alignItems: "center" }]}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: Spacing.sm }]}
            placeholder="Enter image URL"
            value={tempImage}
            onChangeText={setTempImage}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={handleAddImage} style={styles.addButton}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {formData.images.map((img, index) => (
          <View key={index} style={styles.imageItem}>
            <Text numberOfLines={1} style={styles.imageText}>
              {img}
            </Text>
            <TouchableOpacity onPress={() => handleRemoveImage(index)}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <InputText
        label="Description"
        placeholder="Describe your hotel..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        inputWrapperStyle={{ height: 120, minHeight: 120 }}
      />

      <TouchableOpacity style={[styles.submitButton, isLoading && styles.disabledButton]} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitButtonText}>Create Hotel</Text>}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.lg,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: Typography.size.md,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  disabledButton: {
    opacity: 0.7,
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
    backgroundColor: Colors.lightGray, // Ensure this color exists or use '#f5f5f5'
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
})

