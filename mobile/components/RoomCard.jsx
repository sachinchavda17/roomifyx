import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Colors, Typography, Spacing } from "../constants/Theme"
import { useThemeColors } from "./organisms/theme-switch"

const HOTEL_TYPE_LABELS = {
  hotel: "Hotel",
  resort: "Resort",
  guest_house: "Guest House",
  apartment: "Apartment",
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=60&w=800"

export default function RoomCard({ item }) {
  const router = useRouter()
  const colors = useThemeColors()

  const imageUri = item.images?.length > 0 ? item.images[0] : PLACEHOLDER_IMAGE
  const typeLabel = HOTEL_TYPE_LABELS[item.hotel_type] || item.hotel_type
  const location = [item.district, item.state].filter(Boolean).join(", ") || item.address

  const handlePress = () => {
    router.push({
      pathname: `/hotel-detail/${item.id}`,
      params: {
        name: item.name,
        price: item.price || "",
        rating: item.rating,
        address: item.address || "",
        image: imageUri,
      },
    })
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" transition={300} />
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{typeLabel}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.black }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.star} />
            <Text style={[styles.ratingText, { color: colors.black }]}>{item.rating}</Text>
          </View>
        </View>
        <Text style={[styles.location, { color: colors.darkGray }]} numberOfLines={1}>
          {location}
        </Text>
        <View style={styles.priceContainer}>
          {item.price ? (
            <>
              <Text style={[styles.price, { color: colors.black }]}>
                {item.hotel_type === "hotel" || item.hotel_type === "resort" ? "From " : ""}
                ₹{item.price}
              </Text>
              <Text style={[styles.night, { color: colors.black }]}> / night</Text>
            </>
          ) : (
            <Text style={[styles.priceUnavailable, { color: colors.darkGray }]}>Price on request</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.xl,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  typeBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  infoContainer: {
    marginTop: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  ratingText: {
    fontSize: Typography.size.sm,
    color: Colors.black,
    marginLeft: 4,
  },
  location: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },
  price: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
  },
  night: {
    fontSize: Typography.size.sm,
    color: Colors.black,
    fontWeight: Typography.weight.regular,
  },
  priceUnavailable: {
    fontSize: Typography.size.sm,
    color: Colors.darkGray,
    fontStyle: "italic",
  },
})
