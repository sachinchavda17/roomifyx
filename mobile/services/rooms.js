import { http } from "."

export const getPublicRooms = async (hotelId) => http.get({ endpoint: `/rooms/public/hotels/${hotelId}/rooms` })
export const createRoom = async (data) => http.post({ endpoint: "/rooms/", payload: data })
export const getRoomsByHotel = async (hotelId) => http.get({ endpoint: `/rooms/hotel/${hotelId}` })
