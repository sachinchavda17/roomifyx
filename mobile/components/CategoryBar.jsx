import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Typography, Spacing } from "../constants/Theme"
import { useThemeColors } from "./organisms/theme-switch"

export default function CategoryBar({ categories, activeCategory, onCategoryChange }) {
  const colors = useThemeColors()
  return (
    <View style={[styles.container, { borderBottomColor: colors.border, backgroundColor: colors.white }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name
          return (
            <TouchableOpacity key={cat.name} style={styles.categoryItem} onPress={() => onCategoryChange(cat.name)}>
              <Ionicons name={cat.icon} size={24} color={isActive ? colors.black : colors.darkGray} />
              <Text style={[styles.categoryText, { color: colors.darkGray }, isActive && { color: colors.black }]}>{cat.name}</Text>
              {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.black }]} />}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 4,
  },
  categoryItem: {
    marginRight: 25,
    alignItems: "center",
    paddingVertical: 10,
    minWidth: 60,
  },
  categoryText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.darkGray,
    marginTop: 4,
  },
  activeCategoryText: {
    color: Colors.black,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 2,
    backgroundColor: Colors.black,
  },
})

