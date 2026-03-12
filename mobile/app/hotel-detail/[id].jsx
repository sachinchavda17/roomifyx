import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Share, Linking } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter, Stack } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState } from "react"
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, Extrapolation } from "react-native-reanimated"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { HOTEL_DETAIL_CONTENT } from "../../constants/HotelDetailContent"
import { useQuery } from "../../hooks/use-query"
import { getPublicHotel } from "../../services/hotels"
import { getPublicRooms } from "../../services/rooms"
import { CircularLoader } from "../../components/molecules/circular-loader"
import { MULTI_ROOM_TYPES } from "../../constants/hotel"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.85

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=60&w=800"

const HOTEL_TYPE_LABELS = {
    hotel: "Hotel",
    resort: "Resort",
    guest_house: "Guest House",
    apartment: "Apartment",
}

const AMENITY_ICONS = {
    WiFi: "wifi",
    AC: "snow-outline",
    TV: "tv-outline",
    "Hot Water": "water-outline",
    "Room Service": "restaurant-outline",
    "Mini Bar": "wine-outline",
    Balcony: "leaf-outline",
    Parking: "car-outline",
    Gym: "fitness-outline",
    Pool: "water-outline",
}

export default function HotelDetailScreen() {
    const { id, name, price, rating, address, image } = useLocalSearchParams()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const scrollY = useSharedValue(0)
    const [liked, setLiked] = useState(false)
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const { data: hotel, isLoading } = useQuery({
        queryKey: ["hotel-detail", id],
        queryFn: () => getPublicHotel(id),
        enabled: !!id,
    })

    const hotelData = hotel || { name, price: Number(price) || null, rating, address, images: image ? [image] : [] }
    const images = hotelData.images?.length > 0 ? hotelData.images : (image ? [image] : [])
    const isMultiRoom = MULTI_ROOM_TYPES.includes(hotelData.hotel_type)
    const typeLabel = HOTEL_TYPE_LABELS[hotelData.hotel_type] || ""
    const location = [hotelData.district, hotelData.state].filter(Boolean).join(", ") || hotelData.address

    // Fetch rooms for multi-room hotels
    const { data: rooms, isLoading: roomsLoading } = useQuery({
        queryKey: ["public-rooms", id],
        queryFn: () => getPublicRooms(id),
        enabled: !!id && isMultiRoom,
    })

    const availableRooms = (rooms || []).filter((r) => r.status === "available")

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y
        },
    })

    const headerOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [IMAGE_HEIGHT - 150, IMAGE_HEIGHT - 80], [0, 1], Extrapolation.CLAMP),
    }))

    const imageScale = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(scrollY.value, [-100, 0], [1.3, 1], Extrapolation.CLAMP),
            },
        ],
    }))

    const handleShare = async () => {
        try {
            const priceText = hotelData.price ? ` ₹${hotelData.price}/night` : ""
            await Share.share({
                message: `Check out ${hotelData.name} on RoomifyX!${priceText}`,
            })
        } catch (error) {
            // silently fail
        }
    }

    const onImageScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
        setActiveImageIndex(index)
    }

    const handleReserve = () => {
        router.push({
            pathname: `/reserve/${id}`,
            params: {
                name: hotelData.name,
                price: hotelData.price || "",
                rating: hotelData.rating,
                address: hotelData.address || "",
                image: images[0] || "",
            },
        })
    }

    if (isLoading && !name) {
        return (
            <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
                <CircularLoader />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Animated sticky header */}
            <Animated.View style={[styles.stickyHeader, { paddingTop: insets.top }, headerOpacity]}>
                <View style={styles.stickyHeaderContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.stickyHeaderButton}>
                        <Ionicons name="arrow-back" size={22} color={Colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.stickyHeaderTitle} numberOfLines={1}>
                        {hotelData.name}
                    </Text>
                    <TouchableOpacity onPress={handleShare} style={styles.stickyHeaderButton}>
                        <Ionicons name="share-outline" size={22} color={Colors.black} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} showsVerticalScrollIndicator={false} bounces={true}>
                {/* Image carousel */}
                <View style={styles.imageContainer}>
                    <Animated.View style={imageScale}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={onImageScroll}
                            decelerationRate="fast"
                        >
                            {images.length > 0 ? (
                                images.map((img, index) => (
                                    <Image key={index} source={{ uri: img }} style={styles.heroImage} contentFit="cover" transition={300} />
                                ))
                            ) : (
                                <Image source={{ uri: PLACEHOLDER_IMAGE }} style={styles.heroImage} contentFit="cover" transition={300} />
                            )}
                        </ScrollView>
                    </Animated.View>

                    {/* Overlay buttons */}
                    <View style={[styles.imageOverlay, { top: insets.top + 10 }]}>
                        <TouchableOpacity style={styles.overlayButton} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color={Colors.black} />
                        </TouchableOpacity>
                        <View style={styles.overlayRight}>
                            <TouchableOpacity style={styles.overlayButton} onPress={handleShare}>
                                <Ionicons name="share-outline" size={22} color={Colors.black} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.overlayButton} onPress={() => setLiked(!liked)}>
                                <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={liked ? Colors.red : Colors.black} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Image pagination dots */}
                    {images.length > 1 && (
                        <View style={styles.pagination}>
                            {images.map((_, index) => (
                                <View key={index} style={[styles.paginationDot, activeImageIndex === index && styles.paginationDotActive]} />
                            ))}
                        </View>
                    )}
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    {/* Title section */}
                    <View style={styles.titleSection}>
                        {typeLabel ? (
                            <View style={styles.typeBadgeRow}>
                                <View style={styles.typeBadge}>
                                    <Text style={styles.typeBadgeText}>{typeLabel}</Text>
                                </View>
                            </View>
                        ) : null}
                        <Text style={styles.hotelName}>{hotelData.name}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color={Colors.star} />
                            <Text style={styles.ratingText}>{hotelData.rating}</Text>
                        </View>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={16} color={Colors.darkGray} />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>
                        {hotelData.address && location !== hotelData.address && (
                            <Text style={styles.addressText}>{hotelData.address}</Text>
                        )}
                    </View>

                    <View style={styles.divider} />

                    {/* Quick info for guest houses */}
                    {!isMultiRoom && (hotelData.max_guests || hotelData.price) && (
                        <>
                            <View style={styles.quickInfoRow}>
                                {hotelData.max_guests && (
                                    <View style={styles.quickInfoItem}>
                                        <Ionicons name="people-outline" size={22} color={Colors.primary} />
                                        <Text style={styles.quickInfoLabel}>Up to {hotelData.max_guests} guests</Text>
                                    </View>
                                )}
                                {hotelData.price && (
                                    <View style={styles.quickInfoItem}>
                                        <Ionicons name="pricetag-outline" size={22} color={Colors.primary} />
                                        <Text style={styles.quickInfoLabel}>₹{hotelData.price} / night</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* Description */}
                    {hotelData.description && (
                        <>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>About this place</Text>
                                <Text style={styles.descriptionText}>{hotelData.description}</Text>
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* Amenities */}
                    {hotelData.amenities?.length > 0 && (
                        <>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>What this place offers</Text>
                                <View style={styles.amenitiesGrid}>
                                    {hotelData.amenities.map((amenity, index) => (
                                        <View key={index} style={styles.amenityItem}>
                                            <Ionicons
                                                name={AMENITY_ICONS[amenity] || "checkmark-circle-outline"}
                                                size={24}
                                                color={Colors.black}
                                            />
                                            <Text style={styles.amenityLabel}>{amenity}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* Rooms section for multi-room hotels */}
                    {isMultiRoom && (
                        <>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Available Rooms</Text>
                                {roomsLoading ? (
                                    <View style={styles.roomsLoading}>
                                        <CircularLoader />
                                    </View>
                                ) : availableRooms.length > 0 ? (
                                    <View style={styles.roomsList}>
                                        {availableRooms.map((room) => (
                                            <View key={room.id} style={styles.roomItem}>
                                                {room.images?.length > 0 ? (
                                                    <Image source={{ uri: room.images[0] }} style={styles.roomImage} contentFit="cover" transition={200} />
                                                ) : (
                                                    <View style={[styles.roomImage, styles.roomImagePlaceholder]}>
                                                        <Ionicons name="bed-outline" size={24} color={Colors.darkGray} />
                                                    </View>
                                                )}
                                                <View style={styles.roomInfo}>
                                                    <Text style={styles.roomType}>
                                                        {(room.room_type || "Standard").charAt(0).toUpperCase() + (room.room_type || "standard").slice(1)}
                                                    </Text>
                                                    <Text style={styles.roomTitle} numberOfLines={1}>
                                                        {room.title || `Room ${room.room_number}`}
                                                    </Text>
                                                    <Text style={styles.roomPrice}>₹{room.price} / night</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.noRooms}>
                                        <Ionicons name="bed-outline" size={36} color={Colors.lightGray} />
                                        <Text style={styles.noRoomsText}>No rooms available right now</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* Contact info */}
                    {(hotelData.contact_phone || hotelData.contact_email) && (
                        <>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Contact</Text>
                                {hotelData.contact_phone && (
                                    <TouchableOpacity
                                        style={styles.contactRow}
                                        onPress={() => Linking.openURL(`tel:${hotelData.contact_phone}`)}
                                    >
                                        <Ionicons name="call-outline" size={20} color={Colors.primary} />
                                        <Text style={styles.contactText}>{hotelData.contact_phone}</Text>
                                        <Ionicons name="chevron-forward" size={16} color={Colors.darkGray} />
                                    </TouchableOpacity>
                                )}
                                {hotelData.contact_email && (
                                    <TouchableOpacity
                                        style={styles.contactRow}
                                        onPress={() => Linking.openURL(`mailto:${hotelData.contact_email}`)}
                                    >
                                        <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                                        <Text style={styles.contactText}>{hotelData.contact_email}</Text>
                                        <Ionicons name="chevron-forward" size={16} color={Colors.darkGray} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* House Rules */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>House rules</Text>
                        {HOTEL_DETAIL_CONTENT.houseRules.map((rule, index) => (
                            <View key={index} style={styles.ruleItem}>
                                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.secondary} />
                                <Text style={styles.ruleText}>{rule}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    {/* Cancellation Policy */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Cancellation policy</Text>
                        <Text style={styles.descriptionText}>{HOTEL_DETAIL_CONTENT.cancellationPolicy}</Text>
                    </View>

                    {/* Bottom spacing for the booking bar */}
                    <View style={{ height: 100 }} />
                </View>
            </Animated.ScrollView>

            {/* Bottom booking bar */}
            <View style={[styles.bookingBar, { paddingBottom: insets.bottom || 16 }]}>
                <View style={styles.priceContainer}>
                    {hotelData.price ? (
                        <>
                            <Text style={styles.priceText}>
                                {isMultiRoom ? "From " : ""}₹{hotelData.price}
                            </Text>
                            <Text style={styles.priceNight}> / night</Text>
                        </>
                    ) : (
                        <Text style={styles.priceNight}>Select dates & room</Text>
                    )}
                </View>
                <TouchableOpacity style={styles.reserveButton} activeOpacity={0.85} onPress={handleReserve}>
                    <Text style={styles.reserveButtonText}>Reserve</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
    },
    // Sticky header
    stickyHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    stickyHeaderContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.md,
        height: 48,
    },
    stickyHeaderButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    stickyHeaderTitle: {
        flex: 1,
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
        textAlign: "center",
        marginHorizontal: Spacing.sm,
    },
    // Image
    imageContainer: {
        position: "relative",
        height: IMAGE_HEIGHT,
        overflow: "hidden",
    },
    heroImage: {
        width: SCREEN_WIDTH,
        height: IMAGE_HEIGHT,
    },
    imageOverlay: {
        position: "absolute",
        left: Spacing.md,
        right: Spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    overlayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    overlayRight: {
        flexDirection: "row",
    },
    pagination: {
        position: "absolute",
        bottom: 16,
        alignSelf: "center",
        flexDirection: "row",
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        marginHorizontal: 3,
    },
    paginationDotActive: {
        backgroundColor: Colors.white,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    // Content
    contentContainer: {
        padding: Spacing.lg,
    },
    titleSection: {
        marginBottom: Spacing.sm,
    },
    typeBadgeRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    typeBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeBadgeText: {
        color: Colors.white,
        fontSize: Typography.size.xs,
        fontWeight: Typography.weight.semibold,
    },
    hotelName: {
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    ratingText: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
        marginLeft: 4,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    locationText: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
        marginLeft: 4,
    },
    addressText: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
        marginTop: 4,
        marginLeft: 20,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.lg,
    },
    // Quick info
    quickInfoRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Spacing.lg,
    },
    quickInfoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
    },
    quickInfoLabel: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
    },
    // Sections
    section: {
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
        marginBottom: Spacing.md,
    },
    descriptionText: {
        fontSize: Typography.size.md,
        color: Colors.gray[700],
        lineHeight: 24,
    },
    // Amenities
    amenitiesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    amenityItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "50%",
        paddingVertical: Spacing.sm,
    },
    amenityLabel: {
        fontSize: Typography.size.sm,
        color: Colors.black,
        marginLeft: Spacing.sm,
    },
    // Rooms
    roomsLoading: {
        height: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    roomsList: {
        gap: Spacing.sm,
    },
    roomItem: {
        flexDirection: "row",
        backgroundColor: Colors.gray[100],
        borderRadius: 14,
        overflow: "hidden",
    },
    roomImage: {
        width: 100,
        height: 90,
    },
    roomImagePlaceholder: {
        backgroundColor: Colors.gray[200],
        justifyContent: "center",
        alignItems: "center",
    },
    roomInfo: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: "center",
    },
    roomType: {
        fontSize: Typography.size.xs,
        fontWeight: Typography.weight.bold,
        color: Colors.primary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    roomTitle: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
        marginBottom: 4,
    },
    roomPrice: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
    },
    noRooms: {
        alignItems: "center",
        paddingVertical: Spacing.xl,
    },
    noRoomsText: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
        marginTop: Spacing.sm,
    },
    // Contact
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.border,
    },
    contactText: {
        flex: 1,
        fontSize: Typography.size.sm,
        color: Colors.black,
        marginLeft: Spacing.sm,
    },
    // Rules
    ruleItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
    },
    ruleText: {
        fontSize: Typography.size.sm,
        color: Colors.black,
        marginLeft: Spacing.sm,
    },
    // Booking bar
    bookingBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.lg,
        paddingTop: 16,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    priceText: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
    },
    priceNight: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
    },
    reserveButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 10,
    },
    reserveButtonText: {
        color: Colors.white,
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold,
    },
})
