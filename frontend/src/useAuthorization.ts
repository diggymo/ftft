import { useToast } from "@chakra-ui/react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useAuthorization = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const authorization = localStorage.getItem("authorization")

  useEffect(() => {

    if (authorization === null || authorization === "") {
      if (!toast.isActive("redirect-to-login")) {
        toast({
          id: "redirect-to-login",
          position: 'bottom',
          status: "warning",
          title: "まずはログインしてください",
        })
      }
      navigate("/login")
    }
    
    
  }, [authorization, navigate, toast])

  return authorization
}