import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export const useAuthorization = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const authorization = searchParams.get("authorization")

  useEffect(() => {
    if (authorization !== null && authorization !== "") {
      localStorage.setItem("authorization", authorization)
      searchParams.delete("authorization")
      setSearchParams(searchParams)
    }
  }, [authorization])

  return authorization || localStorage.getItem("authorization") || ""
}