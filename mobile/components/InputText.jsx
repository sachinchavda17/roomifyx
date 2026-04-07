import { View, Text, StyleSheet } from "react-native"
import { Colors, Spacing, Typography } from "../constants/Theme"
import { Ionicons } from "@expo/vector-icons"
import AnimatedInputBar from "./base/animated-input-bar"
import { Controller } from "react-hook-form"
import { useThemeColors } from "./organisms/theme-switch"

const InputText = ({
  label,
  placeholder,
  style,
  error,
  icon,
  isRequired,
  control,
  name,
  rules,
  value,
  onChangeText,
  inputWrapperStyle,
  ...props
}) => {
  const colors = useThemeColors()
  const placeholders = [placeholder || "Type here..."]

  // Auto-apply required rule when isRequired=true and no custom rules given
  const resolvedRules = rules ?? (isRequired ? { required: "This field is required" } : undefined)

  const renderInput = (fieldValue, fieldOnChange) => (
    <AnimatedInputBar
      placeholders={placeholders}
      value={fieldValue ?? ""}
      onChangeText={fieldOnChange}
      animationInterval={3000}
      selectionColor={colors.primary}
      containerStyle={styles.animatedContainer}
      inputWrapperStyle={[styles.animatedInputWrapper, inputWrapperStyle]}
      inputStyle={[styles.input, { color: colors.black }]}
      placeholderStyle={[styles.placeholder, { color: colors.darkGray }]}
      {...props}
    />
  )

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.black }]}>
          {label}
          {isRequired && <Text style={[styles.required, { color: colors.red }]}> *</Text>}
        </Text>
      )}
      <View style={[styles.inputWrapper, { backgroundColor: colors.inputBackground, borderColor: colors.lightGray }, error && styles.inputError]}>
        {icon && <Ionicons name={icon} size={18} color={colors.darkGray} style={styles.icon} />}

        {control && name ? (
          // Mode 1: react-hook-form controlled
          <Controller
            control={control}
            name={name}
            rules={resolvedRules}
            render={({ field: { onChange, value: fieldValue } }) => renderInput(fieldValue, onChange)}
          />
        ) : (
          // Mode 2: uncontrolled / manual
          renderInput(value, onChangeText)
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
    width: "100%",
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    height: 55,
    overflow: "hidden",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  icon: {
    marginLeft: Spacing.md,
  },
  animatedContainer: {
    flex: 1,
    marginVertical: 0,
  },
  animatedInputWrapper: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 0,
    minHeight: 55,
    justifyContent: "center",
  },
  input: {
    fontSize: Typography.size.md,
    color: Colors.black,
    fontWeight: "400",
  },
  placeholder: {
    fontSize: Typography.size.md,
    color: Colors.darkGray,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: Typography.size.xs,
    marginTop: 4,
  },
})

export default InputText

