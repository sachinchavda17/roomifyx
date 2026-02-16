import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Share } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter, Stack } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState, useRef } from "react"
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, Extrapolation } from "react-native-reanimated"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { HOTEL_DETAIL_CONTENT } from "../../constants/HotelDetailContent"
import { useQuery } from "../../hooks/use-query"
import { getPublicHotel } from "../../services/hotels"
import { CircularLoader } from "../../components/molecules/circular-loader"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.85

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

    const hotelData = hotel || { name, price, rating, address, images: image ? [image] : [] }
    const images = hotelData.images || (image ? [image] : [])

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
            await Share.share({
                message: `Check out ${hotelData.name} on RoomifyX! ₹${hotelData.price}/night`,
            })
        } catch (error) {
            // silently fail
        }
    }

    const onImageScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
        setActiveImageIndex(index)
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
                                <View style={[styles.heroImage, styles.placeholderImage]}>
                                    <Ionicons name="image-outline" size={60} color={Colors.lightGray} />
                                </View>
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
                                <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={liked ? Colors.primary : Colors.black} />
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
                        <Text style={styles.hotelName}>{hotelData.name}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color={Colors.star} />
                            <Text style={styles.ratingText}>{hotelData.rating}</Text>
                            <Text style={styles.reviewCount}>· 128 reviews</Text>
                        </View>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={16} color={Colors.darkGray} />
                            <Text style={styles.locationText}>{hotelData.address || hotelData.city}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Host info */}
                    <View style={styles.hostSection}>
                        <View style={styles.hostAvatar}>
                            <Ionicons name="person-circle" size={50} color={Colors.darkGray} />
                        </View>
                        <View style={styles.hostInfo}>
                            <Text style={styles.hostName}>Hosted by {HOTEL_DETAIL_CONTENT.hostInfo.name}</Text>
                            <Text style={styles.hostMeta}>
                                Superhost · {HOTEL_DETAIL_CONTENT.hostInfo.responseRate} response rate
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Highlights */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>What this place offers</Text>
                        <View style={styles.highlightsGrid}>
                            {HOTEL_DETAIL_CONTENT.highlights.map((item, index) => (
                                <View key={index} style={styles.highlightItem}>
                                    <Ionicons name={item.icon} size={24} color={Colors.black} />
                                    <Text style={styles.highlightLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About this place</Text>
                        <Text style={styles.descriptionText}>
                            {hotelData.description || HOTEL_DETAIL_CONTENT.description}
                        </Text>
                    </View>

                    <View style={styles.divider} />

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
                    <Text style={styles.priceText}>₹{hotelData.price}</Text>
                    <Text style={styles.priceNight}> / night</Text>
                </View>
                <TouchableOpacity style={styles.reserveButton} activeOpacity={0.85}>
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
    placeholderImage: {
        backgroundColor: Colors.gray[100],
        justifyContent: "center",
        alignItems: "center",
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
    reviewCount: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
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
        textDecorationLine: "underline",
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.lg,
    },
    // Host
    hostSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    hostAvatar: {
        marginRight: Spacing.md,
    },
    hostInfo: {
        flex: 1,
    },
    hostName: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
    },
    hostMeta: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
        marginTop: 2,
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
    highlightsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    highlightItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "50%",
        paddingVertical: Spacing.sm,
    },
    highlightLabel: {
        fontSize: Typography.size.sm,
        color: Colors.black,
        marginLeft: Spacing.sm,
    },
    descriptionText: {
        fontSize: Typography.size.md,
        color: Colors.gray[700],
        lineHeight: 24,
    },
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
