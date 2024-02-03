import { Suspense } from 'react'
import './App.css'
import { Box, Container, Divider, IconButton, Link, Spinner, Text, useToast } from "@chakra-ui/react"
import { FtftList } from './FtftList'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthorization } from './useAuthorization'
import { API_BASE_URL } from './apiClient'
import { FtftForm } from './FtftForm'
import 'react-calendar/dist/Calendar.css';  
import { SettingsIcon } from '@chakra-ui/icons'
import { Link as LinkFromReactRouter } from 'react-router-dom'
import { ServiceTitle } from './ServiceTitle'

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

      const message = `${content}${emoji ? `\n${emoji}` : ''}\n\n-------------\n\nFTFTであなたの"はじめて"を記録しよう✍️\n`
      toast({
        position: 'bottom',
        title: "記録しました✍️",
        description: <p>
          友達に
          <Link href={`https://line.me/R/share?text=${encodeURI(message + "https://liff.line.me/2003019183-014OmGVB")}`}><u>LINE VOOM</u></Link>
          や
          <Link href={`https://twitter.com/intent/tweet?text=${encodeURI(message)}&url=https://liff.line.me/2003019183-014OmGVB`}><u>X</u></Link>
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
      <Container maxW="md" display="flex" flexDirection="column" gap={2} paddingY={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize='3xl'><ServiceTitle>FTFT</ServiceTitle></Text>
          <LinkFromReactRouter to='/setting'>
          <IconButton
          isRound
          aria-label='Search database'
          icon={<SettingsIcon/>}
        />
        </LinkFromReactRouter>
          
        </Box>


        <FtftForm onSaveFtft={saveFtft}/>

        <Divider />

        <Suspense fallback={<Box display="flex" height="200px" alignItems="center" justifyContent="center"><Spinner size="lg" /></Box>}>
          <FtftList />
        </Suspense>


      </Container>
    </>
  )
}
