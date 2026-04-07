import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useQuery } from "../../hooks/use-query"
import { useMutation } from "../../hooks/use-mutation"
import { getRoomsByHotel, deleteRoom } from "../../services/rooms"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useThemeColors } from "../../components/organisms/theme-switch"

export default function ManageRoomsScreen() {
  const { hotel_id } = useLocalSearchParams()
  const router = useRouter()
  const colors = useThemeColors()

  const AddButton = () => (
    <TouchableOpacity style={{ padding: 4 }} onPress={() => router.push({ pathname: "/rooms/add-room", params: { hotel_id } })}>
      <Ionicons name="add" size={28} color={colors.primary} />
    </TouchableOpacity>
  )

  const {
    data: rooms,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["hotel-rooms", hotel_id],
    queryFn: getRoomsByHotel,
    payload: hotel_id,
    enabled: !!hotel_id,
  })

  const { mutate: removeRoom } = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => refetch(),
  })

  const handleDelete = (id) => {
    Alert.alert("Delete Room", "Are you sure you want to delete this room?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeRoom(id) },
    ])
  }

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.lightGray }]}>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.black }]}>{item.title}</Text>
        <Text style={[styles.cardSubtitle, { color: colors.darkGray }]}>
          #{item.room_number} · {item.room_type} · ₹{item.price}/night
        </Text>
      </View>
      <View style={styles.actions}>
        <Link href={{ pathname: `/rooms/${item.id}`, params: { room_id: item.id, hotel_id } }} asChild>
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
      <Stack.Screen options={{ title: "Manage Rooms", headerRight: () => <AddButton /> }} />
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="bed-outline" size={48} color={colors.lightGray} />
              <Text style={[styles.emptyText, { color: colors.darkGray }]}>No rooms yet.</Text>
              <Text style={[styles.emptySubText, { color: colors.darkGray }]}>Add rooms to this hotel to get started.</Text>
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
    flexGrow: 1,
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
