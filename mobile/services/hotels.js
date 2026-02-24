import { http } from "."

export const getPublicHotels = async () => http.get({ endpoint: "/hotels/public" })
export const getMyHotels = async () => http.get({ endpoint: "/hotels/me" })
export const createHotel = async (data) => http.post({ endpoint: "/hotels/", payload: data })
export const updateHotel = async ({ id, data }) => http.put({ endpoint: `/hotels/${id}`, payload: data })
export const deleteHotel = async (id) => http.delete({ endpoint: `/hotels/${id}` })
export const getPublicHotel = async ({id}) => http.get({ endpoint: `/hotels/public/${id}` })

