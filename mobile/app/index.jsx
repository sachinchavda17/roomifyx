import { Text, View, Button, StyleSheet } from "react-native"
import { toast } from "sonner-native"

export default function Index() {
  const showToast = () => {
    toast.success("Welcome back!", {
      description: "This is a smooth, stacking toast notification.",
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Roomifyx</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Show Notification" onPress={showToast} color="#5856D6" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F2F2F7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#1C1C1E",
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
})

