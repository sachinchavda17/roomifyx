import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter, Stack, Link } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState, useMemo } from "react"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useAuth } from "../../context/AuthContext"
import { useQuery } from "../../hooks/use-query"
import { useMutation } from "../../hooks/use-mutation"
import { getPublicRooms } from "../../services/rooms"
import { createBooking } from "../../services/bookings"
import { CircularLoader } from "../../components/molecules/circular-loader"
import { Toast } from "../../components/molecules/toast"
import InputText from "../../components/InputText"

const formatDate = (date) => {
    const d = new Date(date)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const formatDateISO = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

const getDefaultCheckIn = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(0, 0, 0, 0)
    return d
}

const getDefaultCheckOut = () => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    d.setHours(0, 0, 0, 0)
    return d
}

// Simple date picker modal component
function DatePickerModal({ visible, onClose, onSelect, selectedDate, minDate, title }) {
    const [year, setYear] = useState(selectedDate.getFullYear())
    const [month, setMonth] = useState(selectedDate.getMonth())

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const isDateDisabled = (day) => {
        const date = new Date(year, month, day)
        return minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    }

    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11)
            setYear(year - 1)
        } else {
            setMonth(month - 1)
        }
    }

    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0)
            setYear(year + 1)
        } else {
            setMonth(month + 1)
        }
    }

    const isSelected = (day) => {
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year
        )
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={dateStyles.overlay}>
                <View style={dateStyles.container}>
                    <View style={dateStyles.header}>
                        <Text style={dateStyles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={Colors.black} />
                        </TouchableOpacity>
                    </View>

                    <View style={dateStyles.monthNav}>
                        <TouchableOpacity onPress={handlePrevMonth} style={dateStyles.navButton}>
                            <Ionicons name="chevron-back" size={22} color={Colors.black} />
                        </TouchableOpacity>
                        <Text style={dateStyles.monthLabel}>
                            {months[month]} {year}
                        </Text>
                        <TouchableOpacity onPress={handleNextMonth} style={dateStyles.navButton}>
                            <Ionicons name="chevron-forward" size={22} color={Colors.black} />
                        </TouchableOpacity>
                    </View>

                    <View style={dateStyles.weekRow}>
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                            <Text key={d} style={dateStyles.weekDay}>
                                {d}
                            </Text>
                        ))}
                    </View>

                    <View style={dateStyles.daysGrid}>
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <View key={`empty-${i}`} style={dateStyles.dayCell} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const disabled = isDateDisabled(day)
                            const selected = isSelected(day)
                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[dateStyles.dayCell, selected && dateStyles.selectedDay]}
                                    onPress={() => {
                                        if (!disabled) {
                                            onSelect(new Date(year, month, day))
                                            onClose()
                                        }
                                    }}
                                    disabled={disabled}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[dateStyles.dayText, disabled && dateStyles.disabledDay, selected && dateStyles.selectedDayText]}>
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default function ReserveScreen() {
    const { id, name, price, rating, address, image } = useLocalSearchParams()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const { isAuthenticated } = useAuth()

    const [checkIn, setCheckIn] = useState(getDefaultCheckIn)
    const [checkOut, setCheckOut] = useState(getDefaultCheckOut)
    const [selectedRoomId, setSelectedRoomId] = useState(null)
    const [customerName, setCustomerName] = useState("")
    const [customerPhone, setCustomerPhone] = useState("")
    const [showCheckInPicker, setShowCheckInPicker] = useState(false)
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false)

    const { data: rooms, isLoading: roomsLoading } = useQuery({
        queryKey: ["public-rooms", id],
        queryFn: () => getPublicRooms(id),
        enabled: !!id,
    })

    const selectedRoom = useMemo(() => {
        if (!rooms || !selectedRoomId) return null
        return rooms.find((r) => r.id === selectedRoomId)
    }, [rooms, selectedRoomId])

    const nights = useMemo(() => {
        const diff = checkOut.getTime() - checkIn.getTime()
        return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }, [checkIn, checkOut])

    const roomPrice = selectedRoom?.price || Number(price) || 0
    const totalAmount = nights * roomPrice

    const handleCheckInSelect = (date) => {
        setCheckIn(date)
        // Auto-adjust checkout if it's before or same as check-in
        if (checkOut <= date) {
            const newCheckOut = new Date(date)
            newCheckOut.setDate(newCheckOut.getDate() + 1)
            setCheckOut(newCheckOut)
        }
    }

    const bookingMutation = useMutation({
        mutationFn: (data) => createBooking(data),
        onSuccess: (result) => {
            Toast.show("Booking confirmed! 🎉", { type: "success" })
            router.back()
        },
    })

    const handleReserve = () => {
        if (!selectedRoomId) {
            Toast.show("Please select a room", { type: "error" })
            return
        }
        if (!customerName.trim()) {
            Toast.show("Please enter your name", { type: "error" })
            return
        }
        if (!customerPhone.trim()) {
            Toast.show("Please enter your phone number", { type: "error" })
            return
        }
        if (checkIn >= checkOut) {
            Toast.show("Check-out must be after check-in", { type: "error" })
            return  
        }

        bookingMutation.mutate({
            guest_id: id,
            room_id: selectedRoomId,
            check_in: formatDateISO(checkIn),
            check_out: formatDateISO(checkOut),
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim(),
        })
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm reservation</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Hotel summary card */}
                <View style={styles.hotelCard}>
                    <View style={styles.hotelCardInfo}>
                        <Text style={styles.hotelName} numberOfLines={2}>
                            {name}
                        </Text>
                        <View style={styles.hotelMeta}>
                            <Ionicons name="star" size={14} color={Colors.star} />
                            <Text style={styles.hotelRating}>{rating}</Text>
                            <Text style={styles.hotelLocation}> · {address}</Text>
                        </View>
                        <Text style={styles.hotelPrice}>₹{price} / night</Text>
                    </View>
                </View>

                {/* Date selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your trip</Text>

                    <TouchableOpacity style={styles.dateRow} onPress={() => setShowCheckInPicker(true)} activeOpacity={0.7}>
                        <View style={styles.dateInfo}>
                            <Text style={styles.dateLabel}>Check-in</Text>
                            <Text style={styles.dateValue}>{formatDate(checkIn)}</Text>
                        </View>
                        <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dateRow} onPress={() => setShowCheckOutPicker(true)} activeOpacity={0.7}>
                        <View style={styles.dateInfo}>
                            <Text style={styles.dateLabel}>Check-out</Text>
                            <Text style={styles.dateValue}>{formatDate(checkOut)}</Text>
                        </View>
                        <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
                    </TouchableOpacity>

                    <View style={styles.nightsInfo}>
                        <Ionicons name="moon-outline" size={16} color={Colors.darkGray} />
                        <Text style={styles.nightsText}>
                            {nights} {nights === 1 ? "night" : "nights"}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Room selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select a room</Text>
                    {roomsLoading ? (
                        <View style={styles.roomsLoading}>
                            <CircularLoader />
                        </View>
                    ) : rooms && rooms.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomsScroll}>
                            {rooms.map((room) => {
                                const isSelected = selectedRoomId === room.id
                                const isAvailable = room.status === "available"
                                return (
                                    <TouchableOpacity
                                        key={room.id}
                                        style={[styles.roomCard, isSelected && styles.roomCardSelected, !isAvailable && styles.roomCardDisabled]}
                                        onPress={() => isAvailable && setSelectedRoomId(room.id)}
                                        activeOpacity={isAvailable ? 0.7 : 1}
                                        disabled={!isAvailable}
                                    >
                                        <View style={styles.roomCardHeader}>
                                            <Text style={[styles.roomType, isSelected && styles.roomTypeSelected]}>
                                                {room.room_type || room.type || "Standard"}
                                            </Text>
                                            {isSelected && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
                                        </View>
                                        <Text style={[styles.roomNumber, isSelected && styles.roomNumberSelected]}>Room {room.room_number}</Text>
                                        <Text style={[styles.roomPrice, isSelected && styles.roomPriceSelected]}>₹{room.price}/night</Text>
                                        <View style={[styles.roomStatus, isAvailable ? styles.statusAvailable : styles.statusOccupied]}>
                                            <Text style={[styles.roomStatusText, isAvailable ? styles.statusTextAvailable : styles.statusTextOccupied]}>
                                                {isAvailable ? "Available" : "Occupied"}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    ) : (
                        <View style={styles.noRooms}>
                            <Ionicons name="bed-outline" size={40} color={Colors.lightGray} />
                            <Text style={styles.noRoomsText}>No rooms available for this hotel</Text>
                        </View>
                    )}
                </View>

                <View style={styles.divider} />

                {/* Guest info */}
                {isAuthenticated ? (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Guest information</Text>
                            <InputText
                                label="Full Name"
                                value={customerName}
                                onChangeText={setCustomerName}
                                placeholder="Enter your full name"
                                icon="person-outline"
                                isRequired
                            />
                            <InputText
                                label="Phone Number"
                                value={customerPhone}
                                onChangeText={setCustomerPhone}
                                placeholder="Enter your phone number"
                                icon="call-outline"
                                keyboardType="phone-pad"
                                isRequired
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Price breakdown */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Price details</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>
                                    ₹{roomPrice} × {nights} {nights === 1 ? "night" : "nights"}
                                </Text>
                                <Text style={styles.priceValue}>₹{totalAmount}</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Service fee</Text>
                                <Text style={styles.priceValue}>₹0</Text>
                            </View>
                            <View style={[styles.priceRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>₹{totalAmount}</Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={styles.loginPrompt}>
                        <Ionicons name="lock-closed-outline" size={48} color={Colors.lightGray} />
                        <Text style={styles.loginTitle}>Log in to reserve</Text>
                        <Text style={styles.loginSubtitle}>You need to be logged in to make a reservation.</Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Log in</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                )}

                {/* Bottom spacing */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom bar */}
            {isAuthenticated && (
                <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 16 }]}>
                    <View style={styles.bottomPriceContainer}>
                        <Text style={styles.bottomPrice}>₹{totalAmount}</Text>
                        <Text style={styles.bottomPriceLabel}> total</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.confirmButton, bookingMutation.isLoading && styles.confirmButtonDisabled]}
                        onPress={handleReserve}
                        disabled={bookingMutation.isLoading}
                        activeOpacity={0.85}
                    >
                        {bookingMutation.isLoading ? (
                            <CircularLoader size={20} color={Colors.white} />
                        ) : (
                            <Text style={styles.confirmButtonText}>Confirm Reservation</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* Date picker modals */}
            <DatePickerModal
                visible={showCheckInPicker}
                onClose={() => setShowCheckInPicker(false)}
                onSelect={handleCheckInSelect}
                selectedDate={checkIn}
                minDate={new Date()}
                title="Select check-in date"
            />
            <DatePickerModal
                visible={showCheckOutPicker}
                onClose={() => setShowCheckOutPicker(false)}
                onSelect={(date) => setCheckOut(date)}
                selectedDate={checkOut}
                minDate={new Date(checkIn.getTime() + 86400000)}
                title="Select check-out date"
            />
        </View>
    )
}

const dateStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.lg,
    },
    container: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: Spacing.lg,
        width: "100%",
        maxWidth: 380,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
    },
    monthNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Spacing.md,
    },
    navButton: {
        padding: 8,
    },
    monthLabel: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
    },
    weekRow: {
        flexDirection: "row",
        marginBottom: Spacing.sm,
    },
    weekDay: {
        flex: 1,
        textAlign: "center",
        fontSize: Typography.size.xs,
        fontWeight: Typography.weight.semibold,
        color: Colors.darkGray,
    },
    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        width: "14.28%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dayText: {
        fontSize: Typography.size.sm,
        color: Colors.black,
    },
    disabledDay: {
        color: Colors.lightGray,
    },
    selectedDay: {
        backgroundColor: Colors.primary,
        borderRadius: 100,
    },
    selectedDayText: {
        color: Colors.white,
        fontWeight: Typography.weight.bold,
    },
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.md,
        height: 52,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
    },
    scrollContent: {
        padding: Spacing.lg,
    },
    // Hotel card
    hotelCard: {
        flexDirection: "row",
        backgroundColor: Colors.gray[100],
        borderRadius: 16,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
    },
    hotelCardInfo: {
        flex: 1,
    },
    hotelName: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
        marginBottom: 4,
    },
    hotelMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    hotelRating: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
        marginLeft: 4,
    },
    hotelLocation: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
    },
    hotelPrice: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semibold,
        color: Colors.primary,
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
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.lg,
    },
    // Dates
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.gray[100],
        borderRadius: 12,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    dateInfo: {
        flex: 1,
    },
    dateLabel: {
        fontSize: Typography.size.xs,
        color: Colors.darkGray,
        fontWeight: Typography.weight.semibold,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    dateValue: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
    },
    nightsInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: Spacing.sm,
    },
    nightsText: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
        marginLeft: 6,
        fontWeight: Typography.weight.medium,
    },
    // Room selection
    roomsLoading: {
        height: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    roomsScroll: {
        paddingRight: Spacing.md,
    },
    roomCard: {
        width: 160,
        backgroundColor: Colors.gray[100],
        borderRadius: 16,
        padding: Spacing.md,
        marginRight: Spacing.sm,
        borderWidth: 2,
        borderColor: "transparent",
    },
    roomCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: "#FFF5F7",
    },
    roomCardDisabled: {
        opacity: 0.5,
    },
    roomCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    roomType: {
        fontSize: Typography.size.xs,
        fontWeight: Typography.weight.bold,
        color: Colors.darkGray,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    roomTypeSelected: {
        color: Colors.primary,
    },
    roomNumber: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.semibold,
        color: Colors.black,
        marginBottom: 4,
    },
    roomNumberSelected: {
        color: Colors.black,
    },
    roomPrice: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
        marginBottom: 8,
    },
    roomPriceSelected: {
        color: Colors.primary,
    },
    roomStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    statusAvailable: {
        backgroundColor: "#E8F5E9",
    },
    statusOccupied: {
        backgroundColor: "#FFEBEE",
    },
    roomStatusText: {
        fontSize: 10,
        fontWeight: Typography.weight.bold,
        textTransform: "uppercase",
        letterSpacing: 0.3,
    },
    statusTextAvailable: {
        color: "#2E7D32",
    },
    statusTextOccupied: {
        color: "#C62828",
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
    // Price
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    priceLabel: {
        fontSize: Typography.size.md,
        color: Colors.gray[700],
    },
    priceValue: {
        fontSize: Typography.size.md,
        color: Colors.gray[700],
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        marginTop: 8,
        paddingTop: 16,
    },
    totalLabel: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
    },
    totalValue: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
    },
    // Login prompt
    loginPrompt: {
        alignItems: "center",
        paddingVertical: Spacing.xxl,
    },
    loginTitle: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
        marginTop: Spacing.md,
    },
    loginSubtitle: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
        textAlign: "center",
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.xl,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xxl,
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: Spacing.lg,
    },
    loginButtonText: {
        color: Colors.white,
        fontWeight: Typography.weight.bold,
        fontSize: Typography.size.md,
    },
    // Bottom bar
    bottomBar: {
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
    bottomPriceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    bottomPrice: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold,
        color: Colors.black,
    },
    bottomPriceLabel: {
        fontSize: Typography.size.sm,
        color: Colors.darkGray,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 10,
    },
    confirmButtonDisabled: {
        opacity: 0.7,
    },
    confirmButtonText: {
        color: Colors.white,
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold,
    },
})
