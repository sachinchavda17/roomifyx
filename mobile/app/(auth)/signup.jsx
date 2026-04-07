import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useState } from "react"
import { useRouter, Link } from "expo-router"
import { Colors, Spacing, Typography } from "../../constants/Theme"
import { useThemeColors } from "../../components/organisms/theme-switch"
import { useMutation } from "../../hooks/use-mutation"
import { useAuth } from "../../context/AuthContext"
import { signup } from "../../services/auth"
import { Toast } from "../../components/molecules/toast"
import InputText from "../../components/InputText"
import { CircularLoader } from "../../components/molecules/circular-loader"
// import { AnimatedHeaderScrollView } from "../../components/organisms/animated-header-scrollview"
import AnimatedHeaderScrollview from "../../components/organisms/animated-header-scrollview"

export default function SignupScreen() {
  const colors = useThemeColors()
  const { login: handleAuthLogin } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSignup = () => {
    if (!email || !password || !firstName || !lastName) {
      Toast.show("Please fill in all fields", { type: "error" })
      return
    }
    mutate({ email, password, first_name: firstName, last_name: lastName })
  }

  const { isLoading, mutate } = useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      if (data?.token) {
        await handleAuthLogin(data.token)
        router.replace("/(tabs)")
      }
    },
  })

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: colors.white }]}>
      <AnimatedHeaderScrollview
        largeTitle="Create an account"
        subtitle="Join RoomifyX to manage your bookings."
      >
        <View style={styles.form}>
          <View style={styles.row}>
            <InputText
              label="First name"
              placeholder="John"
              value={firstName}
              onChangeText={setFirstName}
              style={{ flex: 1, marginRight: Spacing.sm }}
              isRequired
            />
            <InputText label="Last name" placeholder="Doe" value={lastName} onChangeText={setLastName} style={{ flex: 1 }} isRequired />
          </View>

          <InputText
            label="Email"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            isRequired
          />

          <InputText label="Password" placeholder="At least 8 characters" value={password} onChangeText={setPassword} secureTextEntry isRequired />

          <TouchableOpacity style={[styles.signupButton, { backgroundColor: colors.primary, shadowColor: colors.primary }, isLoading && { opacity: 0.8 }]} onPress={handleSignup} disabled={isLoading}>
            {isLoading ? (
              <CircularLoader size={20} strokeWidth={2.5} activeColor={Colors.white} />
            ) : (
              <Text style={styles.signupButtonText}>Create account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.darkGray }]}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={[styles.loginLink, { color: colors.black }]}>Log in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </AnimatedHeaderScrollview>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  form: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: "row",
    marginBottom: Spacing.md,
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
  termsText: {
    fontSize: Typography.size.xs,
    color: Colors.darkGray,
    lineHeight: 18,
    marginBottom: Spacing.xl,
  },
  boldText: {
    fontWeight: Typography.weight.bold,
    color: Colors.black,
  },
  signupButton: {
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
  signupButtonText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
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
  loginLink: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.black,
    textDecorationLine: "underline",
  },
})

