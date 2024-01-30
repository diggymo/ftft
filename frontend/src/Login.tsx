import './App.css'
import { Box, Button, Divider, Text, useToast } from "@chakra-ui/react"
import { useEffect, useMemo } from 'react'
import liff from '@line/liff';
import { API_BASE_URL } from './apiClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ServiceTitle } from './ServiceTitle';

export const Login = () => {

  const uri = new URL(window.location.href);
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const toast = useToast()

  const state = useMemo(() => {
    const newState = crypto.getRandomValues(new Uint8Array(16)).join("")
    localStorage.setItem("lineLoginState", newState)
    return newState
  }, [])

  const redirectUrl = useMemo(() => {
    return encodeURI(uri.origin + "/line-login-callback")
  }, [])

  const loginWithLiff = async () => {
    if (!liff.isLoggedIn()) {
      console.error("ログインしていません")
      return
    }
    
    const idToken = liff.getIDToken()

    const response = await fetch(API_BASE_URL + '/social-login/line/liff', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken: idToken })
    })
    if (response.status !== 201) throw new Error("ログインに失敗しました")
    const json = await response.json()

    localStorage.setItem("authorization", json.accessToken)

    navigate({
      pathname: '/',
    })
    toast({
      position: 'bottom',
      title: "ログインしました",
      description: "さっそく、きょうのはじめてを記録しましょう"
    })

  }

  useEffect(() => {
    if (searchParams.get("liffcallback") === "true") {
      loginWithLiff()
    }
  }, [])

  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2003019183&redirect_uri=${redirectUrl}&state=${state}&scope=profile%20openid`

  return (
    <Box display="grid" placeContent="center" height="100vh">
      <Box display="flex"  flexDirection="column" alignItems="center" gap={8} padding={8}>
        <Box>
        <Text fontSize="4xl" fontWeight="bold"><ServiceTitle>FTFTで</ServiceTitle></Text>

        
        <Text fontSize="3xl" fontWeight="bold" >はじめてを記録しよう</Text>
        </Box>

        <Divider/>

        <Button onClick={async () => {

          if (liff.isInClient()) {
            await liff.init({
              liffId: '2003019183-014OmGVB',
            });
            if (!liff.isLoggedIn()) {
              const url = new URL(window.location.href)
              url.searchParams.append("liffcallback", "true")
              liff.login({ redirectUri: url.toString() })
              return
            }

            await loginWithLiff()

          } else {
            window.location.href = lineLoginUrl
          }

        }}>LINEでログイン</Button>
      </Box>
    </Box>
  )
}
