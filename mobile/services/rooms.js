import { http } from "."

export const getPublicRooms = async (hotelId) => http.get({ endpoint: `/rooms/public/hotels/${hotelId}/rooms` })
