import { useEffect } from "react"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import Toast from "react-native-toast-message"

export const useQuery = ({
  queryKey,
  queryFn,
  payload,
  onSuccess = () => {},
  onError = () => {},
  showSuccess = false,
  showError = false,
  ...rest
}) => {
  const { data, isError, error, isRefetching, dataUpdatedAt, ...others } = useTanstackQuery({
    queryKey,
    queryFn: () => queryFn(payload),
    retry: false,
    ...rest,
  })

  useEffect(() => {
    if (isError) {
      onError(error)
      if (showError) {
        const description = error?.msg || "Something went wrong !"
        Toast.show({ type: "error", text1: "Error", text2: description })
      }
    }
  }, [isError])

  useEffect(() => {
    if (data) {
      onSuccess(data)
      if (showSuccess) {
        Toast.show({ type: "success", text1: "Success", text2: data.msg || data.message || "Operation successful" })
      }
    }
  }, [data, dataUpdatedAt])

  return { data, isError, error, ...others }
}

