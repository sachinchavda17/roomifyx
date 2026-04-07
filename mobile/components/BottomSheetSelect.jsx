import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Colors, Spacing, Typography } from "../constants/Theme"
import { useThemeColors } from "./organisms/theme-switch"

export default function BottomSheetSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  title = "Select an option",
  isRequired,
  style,
  error,
  disabled,
}) {
  const colors = useThemeColors()
  const [visible, setVisible] = useState(false)

  const selectedOption = options.find((o) => o.value === value)

  const handleSelect = (option) => {
    onChange(option.value)
    setVisible(false)
  }

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {isRequired && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Trigger */}
      <TouchableOpacity style={[styles.trigger, { borderColor: colors.lightGray, backgroundColor: colors.inputBackground }, error && styles.triggerError, disabled && styles.disabled]} onPress={() => !disabled && setVisible(true)} activeOpacity={0.7}>
        <Text style={[styles.triggerText, { color: colors.black }, !selectedOption && { color: colors.darkGray }]}>{selectedOption ? selectedOption.label : placeholder}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.darkGray} />
      </TouchableOpacity>

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Modal Sheet */}
      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />

        {/* Sheet */}
        <View style={[styles.sheet, { backgroundColor: colors.white }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.lightGray }]} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.black }]}>{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={22} color={colors.black} />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isSelected = item.value === value
              return (
                <TouchableOpacity style={[styles.option, isSelected && styles.optionSelected]} onPress={() => handleSelect(item)} activeOpacity={0.7}>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{item.label}</Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                </TouchableOpacity>
              )
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.red,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 55,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    backgroundColor: "#F9F9F9",
  },
  triggerError: {
    borderColor: "#FF3B30",
  },
  triggerText: {
    fontSize: Typography.size.md,
    color: Colors.black,
    flex: 1,
  },
  placeholder: {
    color: Colors.darkGray,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: Typography.size.xs,
    marginTop: 4,
  },
  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    maxHeight: "60%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
    alignSelf: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.black,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: "#FFF0F3",
  },
  optionText: {
    fontSize: Typography.size.md,
    color: Colors.black,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray[100],
  },
  disabled: {
    opacity: 0.5,
  },
})
