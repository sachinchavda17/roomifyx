import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Colors, Typography, Spacing } from "../constants/Theme"

export default function RoomCard({ item }) {
  const router = useRouter()

  const handlePress = () => {
    router.push({
      pathname: `/hotel-detail/${item.id}`,
      params: {
        name: item.name,
        price: item.price,
        rating: item.rating,
        address: item.address || item.city,
        image: item.images?.[0] || "",
      },
    })
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.image} contentFit="cover" transition={300} />
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.star} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.location}>{item.address}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.night}> / night</Text>
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
})

