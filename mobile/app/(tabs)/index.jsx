import { View, FlatList, StyleSheet } from "react-native"
import { useState } from "react"
import { Colors, Spacing } from "../../constants/Theme"
import { ROOMS, CATEGORIES } from "../../constants/MockData"
import RoomCard from "../../components/RoomCard"
import SearchHeader from "../../components/SearchHeader"
import CategoryBar from "../../components/CategoryBar"

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState("Amazing Views")

  return (
    <View style={styles.container}>
      <SearchHeader />
      <CategoryBar categories={CATEGORIES} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <FlatList
        data={ROOMS}
        renderItem={({ item }) => <RoomCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
})


