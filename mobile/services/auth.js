import { http } from "."

export const login = async (payload) => http.post({ endpoint: "/auth/login", payload })
export const signup = async (payload) => http.post({ endpoint: "/auth/register", payload })

