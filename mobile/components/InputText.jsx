import { View, Text, StyleSheet } from "react-native"
import { Colors, Spacing, Typography } from "../constants/Theme"
import { Ionicons } from "@expo/vector-icons"
import AnimatedInputBar from "./base/animated-input-bar"

const InputText = ({ label, value, onChangeText, placeholder, style, error, icon, isRequired, ...props }) => {
  // Ensure placeholders is an array
  const placeholders = [placeholder || "Type here..."]

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {isRequired && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && <Ionicons name={icon} size={18} color={Colors.darkGray} style={styles.icon} />}
        <AnimatedInputBar
          placeholders={placeholders}
          value={value}
          onChangeText={onChangeText}
          animationInterval={3000}
          selectionColor={Colors.primary}
          containerStyle={styles.animatedContainer}
          inputWrapperStyle={styles.animatedInputWrapper}
          inputStyle={styles.input}
          placeholderStyle={styles.placeholder}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
    marginLeft: Spacing.xs,
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

