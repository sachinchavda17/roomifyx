import { useEffect } from "react"
import { useMutation as useTanstackMutation } from "@tanstack/react-query"
import { Toast } from "../components/molecules/toast"

export const useMutation = ({ mutationFn, onSuccess = () => {}, onError = () => {}, showSuccess = true, showError = true }) => {
  const onMutationSuccess = (data, variables) => {
    if (data) onSuccess(data, variables)
    if (showSuccess) {
      Toast.show(variables?.message || data.msg || data.message || "Operation successful", { type: "success" })
    }
  }

  const { data, isError, error, isSuccess, isPending, ...others } = useTanstackMutation({
    mutationFn: (d) => mutationFn(d),
    onSuccess: (data, variables) => onMutationSuccess(data, variables),
  })

  useEffect(() => {
    if (isError) {
      console.log(error)
      const description = error?.msg || "Something went wrong !"
      if (showError) {
        Toast.show(description, { type: "error" })
      }
      onError(error)
    }
  }, [isError])

  return { data, isError, error, isSuccess, isLoading: isPending, ...others }
}

