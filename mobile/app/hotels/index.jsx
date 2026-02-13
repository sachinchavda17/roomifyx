import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { useQuery } from "../../hooks/use-query"
import { getMyHotels, deleteHotel } from "../../services/hotels"
import { useMutation } from "../../hooks/use-mutation"
import { Ionicons } from "@expo/vector-icons"
import { Link, useRouter, Stack } from "expo-router"
import { Colors, Spacing, Typography } from "../../constants/Theme"

export default function MyHotelsScreen() {
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
    Alert.alert("Delete Hotel", "Are you sure you want to delete this hotel?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeHotel(id) },
    ])
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.city}</Text>
      </View>
      <View style={styles.actions}>
        <Link href={`/hotels/${item.id}`} asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color={Colors.error || "#FF4444"} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No hotels found. Add one to get started!</Text>
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
  },
  cardTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
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
    color: Colors.darkGray,
    textAlign: "center",
  },
})

