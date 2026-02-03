import { useEffect } from "react"
import { useMutation as useTanstackMutation } from "@tanstack/react-query"
import Toast from "react-native-toast-message"

export const useMutation = ({ mutationFn, onSuccess = () => {}, onError = () => {}, showSuccess = true, showError = true }) => {
  const onMutationSuccess = (data, variables) => {
    if (data) onSuccess(data, variables)
    if (showSuccess) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: variables?.message || data.msg || data.message || "Operation successful",
      })
    }
  }

  const { data, isError, error, isSuccess, ...others } = useTanstackMutation({
    mutationFn: (d) => mutationFn(d),
    onSuccess: (data, variables) => onMutationSuccess(data, variables),
  })

  useEffect(() => {
    if (isError) {
      const description = error?.msg || "Something went wrong !"
      if (showError) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: description,
        })
      }
      onError(error)
    }
  }, [isError])

  return { data, isError, error, isSuccess, ...others }
}

