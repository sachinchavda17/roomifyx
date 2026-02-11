import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Typography, Spacing } from "../constants/Theme"

export default function CategoryBar({ categories, activeCategory, onCategoryChange }) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name
          return (
            <TouchableOpacity key={cat.name} style={styles.categoryItem} onPress={() => onCategoryChange(cat.name)}>
              <Ionicons name={cat.icon} size={24} color={isActive ? Colors.black : Colors.darkGray} />
              <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>{cat.name}</Text>
              {isActive && <View style={styles.activeIndicator} />}
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

