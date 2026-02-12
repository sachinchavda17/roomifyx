import { createContext, useContext, useEffect, useState } from "react"
import { getItem, setItem, removeItem } from "../utils/storage"

const AuthContext = createContext({
  token: null,
  isLoading: true,
  login: async (token) => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await getItem("token")
        setToken(savedToken)
      } catch (e) {
        console.error("Failed to load session", e)
      } finally {
        setIsLoading(false)
      }
    }
    loadSession()
  }, [])

  const login = async (newToken) => {
    setToken(newToken)
    await setItem("token", newToken)
  }

  const logout = async () => {
    setToken(null)
    await removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

