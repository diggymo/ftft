import './App.css'
import { Box, Text, useToast } from "@chakra-ui/react"
import {  useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { API_BASE_URL } from './apiClient'

export const LineLoginCallback = () => {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {

    const state = localStorage.getItem("lineLoginState") || ""
    if (searchParams.get("state") !== state) {
      toast({
        position: 'bottom',
        status: "error",
        title: "エラーが発生しました",
        description: "時間をあけて再度お試しください"
      })
      navigate({
        pathname: '/login',
      })
      return
    }

    fetch(API_BASE_URL + "/social-login/line/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: searchParams.get("code"),
        callbaclUrl: window.location.href.split("?")[0]
      })
    }).then(response => {
      if (response.status !== 201) {
        throw new Error("ステータスコードが不正です, "+response.status)
      }
      return response.json()
    }).then(responseData => {
      
      navigate({
        pathname: '/',
        search: '?authorization='+responseData.accessToken,
      })
      toast({
        position: 'bottom',
        title: "ログインしました",
        description: "さっそく、きょうのはじめてを記録しましょう"
      })
    }).catch(error=>{
      console.error(error)
      toast({
        position: 'bottom',
        status: "error",
        title: "エラーが発生しました",
        description: "時間をあけて再度お試しください"
      })
      navigate({
        pathname: '/login',
      })
    })
  }, [])

  return (
    <Box display="grid" placeContent="center" height="100vh">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Text >ログイン中です...</Text>
      </Box>
    </Box>
  )
}
