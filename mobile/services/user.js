import { http } from ".";

export const profile = async () => http.get({ endpoint: "/users/me" })
