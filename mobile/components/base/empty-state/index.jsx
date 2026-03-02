import React, { createContext, useMemo } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

const EmptyContext = createContext(undefined)

// ==================== EMPTY COMPONENT ====================

export const Empty = ({ children, variant = "default", style }) => {
  const contextValue = useMemo(
    () => ({
      variant,
    }),
    [variant],
  )

  return (
    <EmptyContext.Provider value={contextValue}>
      <View style={[styles.empty, variant === "outline" && styles.emptyOutline, style]}>{children}</View>
    </EmptyContext.Provider>
  )
}

// ==================== EMPTY HEADER ====================

export const EmptyHeader = ({ children, style }) => {
  return <View style={[styles.emptyHeader, style]}>{children}</View>
}

// ==================== EMPTY MEDIA ====================

export const EmptyMedia = ({ children, variant = "icon", style }) => {
  return <View style={[styles.emptyMedia, variant === "icon" && styles.emptyMediaIcon, style]}>{children}</View>
}

// ==================== EMPTY TITLE ====================

export const EmptyTitle = ({ children, style }) => {
  return <Text style={[styles.emptyTitle, style]}>{children}</Text>
}

// ==================== EMPTY DESCRIPTION ====================

export const EmptyDescription = ({ children, style }) => {
  return <Text style={[styles.emptyDescription, style]}>{children}</Text>
}

// ==================== EMPTY CONTENT ====================

export const EmptyContent = ({ children, style }) => {
  return <View style={[styles.emptyContent, style]}>{children}</View>
}

// ==================== BUTTON COMPONENT ====================

export const EmptyButton = ({ children, variant = "default", size = "md", onPress, style }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "outline" && styles.buttonOutline,
        size === "sm" && styles.buttonSm,
        size === "md" && styles.buttonMd,
        size === "lg" && styles.buttonLg,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text style={[styles.buttonText, variant === "outline" && styles.buttonTextOutline, size === "sm" && styles.buttonTextSm]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  empty: {
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
  },
  emptyOutline: {
    borderWidth: 2,
    borderColor: "#333333",
    borderStyle: "dashed",
  },

  // Empty header
  emptyHeader: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  // Empty media
  emptyMedia: {
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMediaIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty title
  emptyTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },

  // Empty description
  emptyDescription: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  // Empty content
  emptyContent: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  // Button base
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333333",
  },

  // Button sizes
  buttonSm: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonMd: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonLg: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },

  // Button text
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  buttonTextOutline: {
    color: "#ffffff",
  },
  buttonTextSm: {
    fontSize: 12,
  },
})

