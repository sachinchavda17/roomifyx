import { View, StyleSheet, TouchableOpacity } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Typography, Spacing } from "../constants/Theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AnimatedInput from "./base/animated-input-bar"
import { useThemeColors } from "./organisms/theme-switch"

const SEARCH_PLACEHOLDERS = ["Where to?", "Search by hotel name...", "Try a city or district...", "Find guest houses...", "Search resorts nearby..."]

export default function SearchHeader({ onSearch, onFilter }) {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()
  const [text, setText] = useState("")

  const handleChange = (value) => {
    setText(value)
    onSearch?.(value)
  }

  const handleClear = () => {
    setText("")
    onSearch?.("")
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.white }]}>
      <View style={[styles.searchBar, { backgroundColor: colors.white, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
        <AnimatedInput
          placeholders={SEARCH_PLACEHOLDERS}
          value={text}
          onChangeText={handleChange}
          animationInterval={3500}
          returnKeyType="search"
          selectionColor={colors.primary}
          containerStyle={styles.animatedContainer}
          inputWrapperStyle={styles.animatedInputWrapper}
          inputStyle={[styles.inputStyle, { color: colors.black }]}
          placeholderStyle={[styles.placeholderStyle, { color: colors.darkGray }]}
          characterEnterDuration={250}
          characterExitDuration={180}
          characterDelayIncrement={25}
        />
        {text.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={colors.darkGray} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onFilter} style={[styles.filterIcon, { borderColor: colors.lightGray }]}>
            <Ionicons name="options-outline" size={20} color={colors.black} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  searchIcon: {
    marginLeft: 15,
  },
  animatedContainer: {
    flex: 1,
    marginVertical: 0,
  },
  animatedInputWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    minHeight: 60,
    justifyContent: "center",
  },
  inputStyle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.black,
    paddingVertical: 0,
  },
  placeholderStyle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.darkGray,
  },
  clearButton: {
    marginRight: 15,
    padding: 4,
  },
  filterIcon: {
    marginRight: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
})

