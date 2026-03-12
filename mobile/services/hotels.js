import { http } from "."

export const getPublicHotels = async (params) => http.get({ endpoint: "/hotels/public", params })
export const getMyHotels = async () => http.get({ endpoint: "/hotels/me" })
export const createHotel = async (data) => http.post({ endpoint: "/hotels/", payload: data })
export const updateHotel = async ({ payload, id }) => http.put({ endpoint: `/hotels/${id}`, payload })
export const deleteHotel = async (id) => http.delete({ endpoint: `/hotels/${id}` })
export const getPublicHotel = async (id) => http.get({ endpoint: `/hotels/public/${id}` })

