import { View, FlatList, Text, StyleSheet, Dimensions } from "react-native"
import { useState, useCallback } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useThemeColors } from "../../components/organisms/theme-switch"
import { CATEGORIES } from "../../constants/MockData"
import RoomCard from "../../components/RoomCard"
import SearchHeader from "../../components/SearchHeader"
import CategoryBar from "../../components/CategoryBar"
import FilterModal from "../../components/FilterModal"
import { useQuery } from "../../hooks/use-query"
import { getPublicHotels } from "../../services/hotels"
import { CircularLoader } from "../../components/molecules/circular-loader"

export default function ExploreScreen() {
  const colors = useThemeColors()
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [debounceTimer, setDebounceTimer] = useState(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [district, setDistrict] = useState("")

  const selectedCategory = CATEGORIES.find((c) => c.name === activeCategory)
  const hotelType = selectedCategory?.value || undefined

  const { data, isLoading } = useQuery({
    queryKey: ["hotels", debouncedSearch, hotelType, district],
    queryFn: getPublicHotels,
    payload: {
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(hotelType ? { hotel_type: hotelType } : {}),
      ...(district ? { district } : {}),
    },
  })

  const handleApplyFilter = ({ district: d }) => {
    setDistrict(d)
  }

  const handleSearch = useCallback(
    (text) => {
      setSearch(text)
      if (debounceTimer) clearTimeout(debounceTimer)
      const timer = setTimeout(() => setDebouncedSearch(text), 400)
      setDebounceTimer(timer)
    },
    [debounceTimer],
  )

  const hotels = data || []
  const isEmpty = !isLoading && hotels.length === 0

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <SearchHeader onSearch={handleSearch} onFilter={() => setFilterVisible(true)} />
      <CategoryBar categories={CATEGORIES} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {isLoading ? (
        <View style={styles.centered}>
          <CircularLoader />
        </View>
      ) : isEmpty ? (
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={56} color={colors.lightGray} />
          <Text style={[styles.emptyTitle, { color: colors.black }]}>No hotels found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.darkGray }]}>
            {debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : "Try a different category or check back later"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={hotels}
          renderItem={({ item }) => <RoomCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilter}
        initialDistrict={district}
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
    paddingBottom: Dimensions.get("window").height * 0.09 + Spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
})
