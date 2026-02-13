import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useState } from "react"
import { useRouter, Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors, Spacing, Typography } from "../../constants/Theme"

import { useMutation } from "../../hooks/use-mutation"
import { login } from "../../services/auth"
import { Toast } from "../../components/molecules/toast"
import { useAuth } from "../../context/AuthContext"
import InputText from "../../components/InputText"
import { CircularLoader } from "../../components/molecules/circular-loader"
import AnimatedHeaderScrollview from "../../components/organisms/animated-header-scrollview"

export default function LoginScreen() {
  const { login: handleAuthLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show("Please fill in all fields", { type: "error" })
      return
    }
    mutate({ email, password })
  }

  const { isLoading, mutate } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await handleAuthLogin(data.token)
      router.replace("/(tabs)")
    },
  })

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <AnimatedHeaderScrollview
        largeTitle="Log in"
        subtitle="Welcome back! You've been missed."
        headerBlurConfig={{
          intensity: 20,
          tint: "light",
        }}
      >
        <View style={styles.form}>
          <InputText
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputText label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.loginButton, isLoading && { opacity: 0.8 }]} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <CircularLoader size={20} strokeWidth={2.5} activeColor={Colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <SocialButton icon="logo-google" title="Continue with Google" />
          <SocialButton icon="logo-facebook" title="Continue with Facebook" />
          <SocialButton icon="logo-apple" title="Continue with Apple" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </AnimatedHeaderScrollview>
    </KeyboardAvoidingView>
  )
}

function SocialButton({ icon, title }) {
  return (
    <TouchableOpacity style={styles.socialButton}>
      <Ionicons name={icon} size={20} color={Colors.black} style={styles.socialIcon} />
      <Text style={styles.socialButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  form: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.size.md,
    color: Colors.black,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
    textDecorationLine: "underline",
  },
  loginButton: {
    height: 55,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    color: Colors.darkGray,
    fontSize: Typography.size.sm,
  },
  socialContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  socialButton: {
    flexDirection: "row",
    height: 55,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  socialIcon: {
    position: "absolute",
    left: Spacing.md,
  },
  socialButtonText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.black,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.size.md,
    color: Colors.darkGray,
  },
  signupLink: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.black,
    textDecorationLine: "underline",
  },
})

