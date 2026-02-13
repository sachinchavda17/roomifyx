import { http } from "."

export const profile = async () => http.get({ endpoint: "/users/me" })

export const updateProfile = async (payload) => http.put({ endpoint: "/users/me", payload })

export const deleteAccount = async () => http.delete({ endpoint: "/users/me" })

