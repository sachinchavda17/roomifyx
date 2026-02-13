import { useEffect } from "react"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Toast } from "../components/molecules/toast"

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
  const { data, isError, error, isRefetching, dataUpdatedAt, isPending, ...others } = useTanstackQuery({
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
        Toast.show(description, { type: "error" })
      }
    }
  }, [isError])

  return { data, isError, error, isLoading: isPending, ...others }
}

