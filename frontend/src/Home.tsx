import { Suspense } from 'react'
import './App.css'
import { Box, Container, Divider, Link, Spinner, Text, useToast } from "@chakra-ui/react"
import { FtftList } from './FtftList'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthorization } from './useAuthorization'
import { API_BASE_URL } from './apiClient'
import { FtftForm } from './FtftForm'
import 'react-calendar/dist/Calendar.css';  


export const Home = () => {
  const authorization = useAuthorization()

  const queryClient = useQueryClient()
  const toast = useToast()
  

  const saveFtft = async ({content, fileUrls, emoji, location}: {content: string, fileUrls: string[], emoji?: string, location?: {lat: number, lng: number}}) => {
    await fetch(API_BASE_URL + '/ftft', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authorization}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: content,
        fileUrls,
        emoji,
        location
      })
    }).then(res=>{
      console.log(res.status)
      if (res.status !== 201) throw new Error("送信できませんでした")

      const message = "%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6%E3%81%AExx%E3%82%92%E9%81%94%E6%88%90%F0%9F%9A%80%0D%0Aat%20FTFT"
      toast({
        position: 'bottom',
        title: "記録しました✍️",
        description: <p>
          友達に
          <Link target="_blank" href={`https://line.me/R/share?text=${message}`}>LINE</Link>
          や
          <Link target="_blank" href={`https://twitter.com/intent/tweet?text=${message}&url=https://d3ozb6rt05ntqw.cloudfront.net/`}>X</Link>
          で共有しよう🥰
        </p>
      })
    }).catch(() => {
      toast({
        position: "bottom",
        title: "エラーが発生しました",
        status: "error",
        description: "記録に失敗しました"
      })
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))
    queryClient.invalidateQueries({ queryKey: ["ftfts"] })
  }

  


  return (
    <>
      <Container maxW="md" display="flex" flexDirection="column" gap={2}>
        <Text fontSize='3xl'>FTFT</Text>


        <FtftForm onSaveFtft={saveFtft}/>

        <Divider />

        <Suspense fallback={<Box display="flex" height="200px" alignItems="center" justifyContent="center"><Spinner size="lg" /></Box>}>
          <FtftList />
        </Suspense>


      </Container>
    </>
  )
}
