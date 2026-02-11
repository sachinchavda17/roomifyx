import { useEffect } from "react"
import { useMutation as useTanstackMutation } from "@tanstack/react-query"
import { toast } from "sonner-native"

export const useMutation = ({ mutationFn, onSuccess = () => {}, onError = () => {}, showSuccess = true, showError = true }) => {
  const onMutationSuccess = (data, variables) => {
    if (data) onSuccess(data, variables)
    if (showSuccess) {
      toast.success(variables?.message || data.msg || data.message || "Operation successful")
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
        toast.error(description)
      }
      onError(error)
    }
  }, [isError])

  return { data, isError, error, isSuccess, isLoading: isPending, ...others }
}

