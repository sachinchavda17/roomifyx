import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { useQuery } from "../../hooks/use-query"
import { getMyHotels, deleteHotel } from "../../services/hotels"
import { useMutation } from "../../hooks/use-mutation"
import { Ionicons } from "@expo/vector-icons"
import { Link, useRouter, Stack } from "expo-router"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { HOTEL_TYPES, MULTI_ROOM_TYPES } from "../../constants/hotel"
import { useThemeColors } from "../../components/organisms/theme-switch"

const getHotelTypeLabel = (type) => {
  const found = HOTEL_TYPES.find((t) => t.value === type)
  return found ? found.label : type
}

export default function MyHotelsScreen() {
  const colors = useThemeColors()
  const router = useRouter()
  const {
    data: hotels,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-hotels"],
    queryFn: getMyHotels,
  })

  const { mutate: removeHotel } = useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => refetch(),
  })

  const handleDelete = (id) => {
    Alert.alert("Delete Hotel", "Are you sure you want to delete this hotel and all its rooms?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeHotel(id) },
    ])
  }

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.lightGray }]}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.black }]} numberOfLines={1}>{item.name}</Text>
          {item.hotel_type ? (
            <View style={[styles.typeBadge, { backgroundColor: colors.primary + "18" }]}>
              <Text style={[styles.typeBadgeText, { color: colors.primary }]}>{getHotelTypeLabel(item.hotel_type)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.cardSubtitle, { color: colors.darkGray }]} numberOfLines={1}>
          {[item.district, item.state].filter(Boolean).join(", ") || item.address}
        </Text>
      </View>
      <View style={styles.actions}>
        <Link href={`/hotels/${item.id}`} asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color={colors.red} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, !hotels?.length && { flex: 1 }]}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="business-outline" size={48} color={colors.lightGray} />
              <Text style={[styles.emptyText, { color: colors.darkGray }]}>No hotels yet</Text>
              <Text style={[styles.emptySubText, { color: colors.darkGray }]}>Tap + to add your first hotel</Text>
            </View>
          }
        />
      )}
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
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  card: {
    flexDirection: "row",
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    flexShrink: 1,
  },
  typeBadge: {
    backgroundColor: Colors.primary + "18",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: Typography.size.xs || 11,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
  cardSubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.darkGray,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
    textAlign: "center",
  },
})

