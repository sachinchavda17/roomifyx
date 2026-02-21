import { http } from "."

export const createBooking = async (data) => http.post({ endpoint: "/bookings/", payload: data })
export const getMyBookings = async () => http.get({ endpoint: "/bookings/me" })
