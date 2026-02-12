import * as SecureStore from "expo-secure-store"

export const setItem = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value)
  } catch (error) {
    console.error(`Error setting item ${key}:`, error)
  }
}

export const getItem = async (key) => {
  try {
    return await SecureStore.getItemAsync(key)
  } catch (error) {
    console.error(`Error getting item ${key}:`, error)
    return null
  }
}

export const removeItem = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key)
  } catch (error) {
    console.error(`Error removing item ${key}:`, error)
  }
}

