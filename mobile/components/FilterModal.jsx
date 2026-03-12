import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Typography, Spacing } from "../constants/Theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const DISTRICTS = ["Colombo", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Sigiriya", "Trincomalee", "Jaffna", "Anuradhapura", "Matara"]

export default function FilterModal({ visible, onClose, onApply, initialDistrict = "" }) {
  const insets = useSafeAreaInsets()
  const [district, setDistrict] = useState(initialDistrict)

  const handleApply = () => {
    onApply({ district: district.trim() })
    onClose()
  }

  const handleClear = () => {
    setDistrict("")
    onApply({ district: "" })
    onClose()
  }

  const selectDistrict = (name) => {
    setDistrict((prev) => (prev === name ? "" : name))
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>District</Text>
          <TextInput
            style={styles.input}
            placeholder="Type a district name..."
            placeholderTextColor={Colors.darkGray}
            value={district}
            onChangeText={setDistrict}
          />

          <View style={styles.chips}>
            {DISTRICTS.map((name) => (
              <TouchableOpacity
                key={name}
                style={[styles.chip, district === name && styles.chipActive]}
                onPress={() => selectDistrict(name)}
              >
                <Text style={[styles.chipText, district === name && styles.chipTextActive]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Show results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.black,
  },
  clearText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  sectionTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.size.sm,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.size.xs,
    color: Colors.darkGray,
    fontWeight: Typography.weight.medium,
  },
  chipTextActive: {
    color: Colors.white,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  applyText: {
    color: Colors.white,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
  },
})
