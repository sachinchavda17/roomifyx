import axios from "axios"
import { get as _get, isEmpty } from "lodash"
import AsyncStorage from "@react-native-async-storage/async-storage"

const handleError = (error, reject) => {
  console.log("error", error)
  let msg = "Something went wrong!"
  const response = _get(error, "response.data", "{}")
  try {
    if (!isEmpty(response)) msg = response
  } catch (e) {
    msg = error.message || "An unexpected error occurred"
  }
  reject(msg)
}

const baseURL = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.1.68:8000"

const apiHelper = async ({ method = "GET", endpoint, payload, params, headers = {} }) => {
  const token = await AsyncStorage.getItem("token")
  const userId = await AsyncStorage.getItem("userId")
  const url = baseURL + endpoint
  console.log("url", url)

  console.log("payload", payload)
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      data: payload,
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        userId: userId,
        ...headers,
      },
    })
      .then((response) => {
        const data = _get(response, "data", {})
        resolve(data || {})
      })
      .catch((error) => handleError(error, reject))
  })
}

const post = (args) => apiHelper({ ...args, method: "POST" })
const get = (args) => apiHelper({ ...args, method: "GET" })
const put = (args) => apiHelper({ ...args, method: "PUT" })
const deleteCall = (args) => apiHelper({ ...args, method: "DELETE" })

export const http = { post, get, put, delete: deleteCall }

