import { View, FlatList, StyleSheet } from "react-native"
import { useState } from "react"
import { Colors, Spacing } from "../../constants/Theme"
import { ROOMS, CATEGORIES } from "../../constants/MockData"
import RoomCard from "../../components/RoomCard"
import SearchHeader from "../../components/SearchHeader"
import CategoryBar from "../../components/CategoryBar"
import { useQuery } from "../../hooks/use-query"
import { getPublicHotels } from "../../services/hotels"
import { CircularLoader } from "../../components/molecules/circular-loader"

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState("Amazing Views")

  const { data, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: getPublicHotels,
  })

  console.log("data", data)

  return (
    <View style={styles.container}>
      <SearchHeader />
      <CategoryBar categories={CATEGORIES} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <CircularLoader />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <RoomCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // marginBottom: 38,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
})

