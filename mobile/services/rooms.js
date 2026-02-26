import { http } from "."

export const getPublicRooms = async (hotelId) => http.get({ endpoint: `/rooms/public/hotels/${hotelId}/rooms` })
export const createRoom = async (data) => http.post({ endpoint: "/rooms/", payload: data })
export const getRoomsByHotel = async (hotelId) => http.get({ endpoint: `/rooms/hotel/${hotelId}` })
export const getRoomById = async (roomId) => http.get({ endpoint: `/rooms/${roomId}` })
export const updateRoom = async ({ room_id, data }) => http.put({ endpoint: `/rooms/${room_id}`, payload: data })
export const deleteRoom = async (room_id) => http.delete({ endpoint: `/rooms/${room_id}` })
