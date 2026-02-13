import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { useQuery } from "../../hooks/use-query"
import { useMutation } from "../../hooks/use-mutation"
import { updateHotel, getPublicHotel } from "../../services/hotels"
import { useState, useEffect } from "react"
import { useRouter, Stack, useLocalSearchParams } from "expo-router"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { Toast } from "../../components/molecules/toast"
import InputText from "../../components/InputText"

export default function EditHotelScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
  })

  const { data: hotel, isLoading: isFetching } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => getPublicHotel(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        description: hotel.description || "",
      })
    }
  }, [hotel])

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: (data) => updateHotel({ id, data }),
    onSuccess: () => {
      Toast.show("Hotel updated successfully", { type: "success" })
      router.back()
    },
    onError: (error) => {
      Toast.show(error.message || "Failed to update hotel", { type: "error" })
    },
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.city || !formData.address) {
      Toast.show("Please fill in required fields", { type: "error" })
      return
    }
    mutate(formData)
  }

  if (isFetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Edit Hotel" }} />

      <InputText label="Hotel Name *" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} />

      <View style={styles.row}>
        <InputText
          label="City *"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          style={{ flex: 1, marginRight: Spacing.sm }}
        />
        <InputText
          label="Address *"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          style={{ flex: 1, marginLeft: Spacing.sm }}
        />
      </View>

      <InputText
        label="Description"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        inputWrapperStyle={{ height: 120, minHeight: 120 }}
      />

      <TouchableOpacity style={[styles.submitButton, isUpdating && styles.disabledButton]} onPress={handleSubmit} disabled={isUpdating}>
        {isUpdating ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitButtonText}>Update Hotel</Text>}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

