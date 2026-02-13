import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { useMutation } from "../../hooks/use-mutation"
import { createHotel } from "../../services/hotels"
import { useState } from "react"
import { useRouter, Stack } from "expo-router"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { Toast } from "../../components/molecules/toast"
import InputText from "../../components/InputText"

export default function AddHotelScreen() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    images: [`https://picsum.photos/300/200`], // Unique random image
  })

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
      <Stack.Screen options={{ title: "Add New Hotel" }} />

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
  submitButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
  },
})

